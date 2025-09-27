import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assessmentData from '../data/data.json'
import QuestionCard from '../components/QuestionCard'
import { assessmentAPI } from '../api'
import '../styles/AssessmentPage.css'

// Convert the JSON data to the format expected by the component
const convertPreScreeningQuestions = () => {
  return assessmentData.pre_screening.questions.map((q, index) => ({
    id: (index + 1).toString(), // Convert to string to match answer keys
    question: q.text,
    options: q.options.map((option, optionIndex) => ({
      value: optionIndex.toString(),
      label: option
    })),
    trigger: q.trigger // Store the trigger for this question
  }));
};

const InitialAssessmentPage = () => {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [allQuestions] = useState(convertPreScreeningQuestions())

  // Block browser navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also block browser back/forward buttons
    const handlePopState = () => {
      // Push current state to history to prevent navigation
      window.history.pushState(null, '', window.location.href);
    };
    
    // Push initial state and listen for popstate
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Determine which assessments to trigger based on initial answers
  const determineTriggeredAssessments = () => {
    const triggered = [];
    let hasCrisis = false;
    
    // Check each initial question and its answer
    allQuestions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined && question.trigger) {
        // Special handling for crisis question (Q6)
        if (question.id === "6") { // Now using string ID
          // If answer is "Recently attempted or planned" (option 3) or "Thoughts often" (option 2)
          const answerValue = parseInt(answer);
          if (answerValue >= 2) {
            // Set crisis flag but don't add to triggered assessments
            hasCrisis = true;
          }
        } else {
          // Regular handling for other questions
          // Trigger assessment based on specific answers (not just any answer)
          // For depression (PHQ-9): if answer is "Often" or "Almost constantly" (options 2 or 3)
          // For stress (PSS-10): if answer is "Often" or "Almost constantly" (options 2 or 3)
          const answerValue = parseInt(answer);
          if (answerValue >= 2 && !triggered.includes(question.trigger)) {
            triggered.push(question.trigger);
          }
        }
      }
    });
    
    return { triggered, hasCrisis };
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = async () => {
    // Special handling for the crisis question (Q6)
    if (currentQuestionIndex === 5) { // 6th question (0-indexed)
      const crisisAnswer = answers["6"]; // Use string ID
      if (crisisAnswer !== undefined) {
        const answerValue = parseInt(crisisAnswer);
        if (answerValue >= 2) { // "Thoughts often" or "Recently attempted or planned"
          // Save initial assessment results
          const initialAssessmentResults = {
            answers,
            completedAt: new Date().toISOString(),
            totalQuestions: allQuestions.length
          }
          
          localStorage.setItem('mindware_initial_assessment', JSON.stringify(initialAssessmentResults))
          
          // Set initial assessment completed flag
          localStorage.setItem('mindware_initial_completed', 'true')
          
          // Determine which assessments to trigger (including from other questions)
          const { triggered } = determineTriggeredAssessments();
          localStorage.setItem('mindware_triggered_assessments', JSON.stringify(triggered))
          
          // Set a flag to indicate crisis mode for LockedHomePage
          localStorage.setItem('mindware_crisis_mode', 'true');
          
          // Save to backend
          try {
            const userData = JSON.parse(localStorage.getItem('mindware_user') || '{}');
            if (userData.id) {
              await assessmentAPI.saveInitial({
                userId: userData.id,
                answers: initialAssessmentResults
              });
            }
          } catch (error) {
            console.error('Failed to save assessment to backend:', error);
          }
          
          // Redirect to locked home page (not directly to counselor support)
          navigate('/locked-home');
          return;
        } else {
          // For all other answers (Never, Thoughts occasionally), proceed normally
          // Save initial assessment results
          const initialAssessmentResults = {
            answers,
            completedAt: new Date().toISOString(),
            totalQuestions: allQuestions.length
          }
          
          localStorage.setItem('mindware_initial_assessment', JSON.stringify(initialAssessmentResults))
          
          // Set initial assessment completed flag
          localStorage.setItem('mindware_initial_completed', 'true')
          
          // Determine which assessments to trigger
          const { triggered } = determineTriggeredAssessments();
          
          if (triggered.length > 0) {
            // Save triggered assessments
            localStorage.setItem('mindware_triggered_assessments', JSON.stringify(triggered))
          }
          
          // Remove crisis mode flag if it exists
          localStorage.removeItem('mindware_crisis_mode');
          
          // Save to backend
          try {
            const userData = JSON.parse(localStorage.getItem('mindware_user') || '{}');
            if (userData.id) {
              await assessmentAPI.saveInitial({
                userId: userData.id,
                answers: initialAssessmentResults
              });
            }
          } catch (error) {
            console.error('Failed to save assessment to backend:', error);
          }
          
          // Navigate to locked home page
          navigate('/locked-home')
          return;
        }
      }
    }
    
    if (currentQuestionIndex < allQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Last question reached, go directly to next phase
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    // Save initial assessment results
    const initialAssessmentResults = {
      answers,
      completedAt: new Date().toISOString(),
      totalQuestions: allQuestions.length
    }
    
    // Save to localStorage
    localStorage.setItem('mindware_initial_assessment', JSON.stringify(initialAssessmentResults))
    
    // Set initial assessment completed flag
    localStorage.setItem('mindware_initial_completed', 'true')
    
    // Determine which assessments to trigger
    const { triggered, hasCrisis } = determineTriggeredAssessments();
    
    if (triggered.length > 0) {
      // Save triggered assessments
      localStorage.setItem('mindware_triggered_assessments', JSON.stringify(triggered))
    }
    
    // Handle crisis mode
    if (hasCrisis) {
      localStorage.setItem('mindware_crisis_mode', 'true');
    } else {
      localStorage.removeItem('mindware_crisis_mode');
    }
    
    // Save to backend
    try {
      const userData = JSON.parse(localStorage.getItem('mindware_user') || '{}');
      if (userData.id) {
        await assessmentAPI.saveInitial({
          userId: userData.id,
          answers: initialAssessmentResults
        });
      }
    } catch (error) {
      console.error('Failed to save assessment to backend:', error);
    }
    
    // Navigate to locked home page
    navigate('/locked-home')
  }

  const currentQuestion = allQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        <div className="assessment-header">
          <h1>Initial Mental Health Screening</h1>
          <p>Please answer the following questions honestly to help us understand your current state</p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </span>
          </div>
        </div>

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswerSelect={(answer) => handleAnswer(currentQuestion.id, answer)}
          />
        )}

        <div className="assessment-navigation">
          <button 
            className="btn btn-outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id]}
          >
            {currentQuestionIndex === allQuestions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InitialAssessmentPage