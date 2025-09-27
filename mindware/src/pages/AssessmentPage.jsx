import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assessmentData from '../data/data.json'
import QuestionCard from '../components/QuestionCard'
import Navbar from '../components/Navbar'
import '../styles/AssessmentPage.css'

// Convert the JSON data to the format expected by the component
const convertPreScreeningQuestions = () => {
  return assessmentData.pre_screening.questions.map((q, index) => ({
    id: index + 1,
    question: q.text,
    options: q.options.map((option, optionIndex) => ({
      value: optionIndex.toString(),
      label: option
    })),
    trigger: q.trigger // Store the trigger for this question
  }));
};

// Convert assessment questions
const convertAssessmentQuestions = (assessmentKey) => {
  const assessment = assessmentData.assessments[assessmentKey];
  if (!assessment) return [];
  
  return assessment.questions.map((q, index) => ({
    id: 100 + index, // Different ID range to avoid conflicts
    question: q,
    options: assessment.options.map((option, optionIndex) => ({
      value: optionIndex.toString(),
      label: option
    }))
  }));
};

const AssessmentPage = () => {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [allQuestions, setAllQuestions] = useState(convertPreScreeningQuestions())
  const [showResults, setShowResults] = useState(false)
  const [phase, setPhase] = useState('initial') // 'initial' or 'followup'
  const [triggeredAssessments, setTriggeredAssessments] = useState([])

  // Determine which assessments to trigger based on initial answers
  const determineTriggeredAssessments = () => {
    const initialQuestions = convertPreScreeningQuestions();
    const triggered = [];
    
    // Check each initial question and its answer
    initialQuestions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined && question.trigger) {
        // Trigger assessment based on specific answers (not just any answer)
        // For depression (PHQ-9): if answer is "Often" or "Almost constantly" (options 2 or 3)
        // For stress (PSS-10): if answer is "Often" or "Almost constantly" (options 2 or 3)
        const answerValue = parseInt(answer);
        if (answerValue >= 2 && !triggered.includes(question.trigger)) {
          triggered.push(question.trigger);
        }
      }
    });
    
    return triggered;
  };

  // Check if we've completed initial questions
  const isInitialPhaseComplete = () => {
    return currentQuestionIndex >= convertPreScreeningQuestions().length && phase === 'initial';
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (phase === 'initial' && currentQuestionIndex === convertPreScreeningQuestions().length - 1) {
      // Last initial question - move to follow-up phase
      const triggered = determineTriggeredAssessments();
      setTriggeredAssessments(triggered);
      
      if (triggered.length > 0) {
        // Add questions from triggered assessments
        let newQuestions = convertPreScreeningQuestions();
        triggered.forEach(assessmentKey => {
          const assessmentQuestions = convertAssessmentQuestions(assessmentKey);
          newQuestions = [...newQuestions, ...assessmentQuestions];
        });
        
        setAllQuestions(newQuestions);
        setPhase('followup');
        setCurrentQuestionIndex(convertPreScreeningQuestions().length); // Move to first follow-up question
      } else {
        // No follow-up needed, show results
        setShowResults(true);
      }
    } else if (currentQuestionIndex < allQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Last question reached, show results
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    // Save assessment results (placeholder for backend)
    const assessmentResults = {
      answers,
      completedAt: new Date().toISOString(),
      totalQuestions: allQuestions.length,
      phase: phase,
      triggeredAssessments: triggeredAssessments
    }
    
    localStorage.setItem('mindware_assessment', JSON.stringify(assessmentResults))
    
    // Navigate to home page (no dashboard)
    navigate('/home')
  }

  // If we're still in the initial phase and at the end of initial questions, show a transition message
  const showTransition = isInitialPhaseComplete();

  if (showResults) {
    return (
      <div className="assessment-page">
        // Removed Navbar
        <div className="assessment-container">
          <div className="results-card">
            <div className="results-header">
              <h1>Assessment Complete!</h1>
              <p>Thank you for completing your mental health assessment.</p>
            </div>
            
            <div className="results-content">
              <div className="results-stats">
                <div className="stat-item">
                  <span className="stat-number">{Object.keys(answers).length}</span>
                  <span className="stat-label">Questions Answered</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
              </div>
              
              <div className="results-summary">
                <h3>What's Next?</h3>
                <p>
                  Your responses have been analyzed to provide you with personalized 
                  recommendations and resources. You'll now have access to:
                </p>
                <ul>
                  <li>AI-powered chatbot for immediate support</li>
                  <li>Curated resources based on your assessment</li>
                  <li>Peer support community</li>
                  <li>Professional counselor recommendations</li>
                </ul>
              </div>
            </div>
            
            <button 
              className="btn btn-primary btn-large w-100"
              onClick={handleComplete}
            >
              Continue to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showTransition) {
    return (
      <div className="assessment-page">
        // Removed Navbar
        <div className="assessment-container">
          <div className="results-card">
            <div className="results-header">
              <h1>Initial Screening Complete</h1>
              <p>Based on your responses, we'll now ask additional questions to better understand your needs.</p>
            </div>
            
            {triggeredAssessments.length > 0 && (
              <div className="results-summary">
                <h3>Additional Assessments:</h3>
                <ul>
                  {triggeredAssessments.map((assessmentKey, index) => (
                    <li key={index}>
                      {assessmentData.assessments[assessmentKey].purpose}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              className="btn btn-primary btn-large w-100"
              onClick={() => {
                const triggered = determineTriggeredAssessments();
                setTriggeredAssessments(triggered);
                
                if (triggered.length > 0) {
                  let newQuestions = convertPreScreeningQuestions();
                  triggered.forEach(assessmentKey => {
                    const assessmentQuestions = convertAssessmentQuestions(assessmentKey);
                    newQuestions = [...newQuestions, ...assessmentQuestions];
                  });
                  
                  setAllQuestions(newQuestions);
                  setPhase('followup');
                  setCurrentQuestionIndex(convertPreScreeningQuestions().length);
                } else {
                  setShowResults(true);
                }
              }}
            >
              Continue to Detailed Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100

  return (
    <div className="assessment-page">
      // Removed Navbar
      <div className="assessment-container">
        {phase === 'followup' && currentQuestionIndex === convertPreScreeningQuestions().length && (
          <div className="followup-header">
            <h1>Detailed Assessment</h1>
            <p>Based on your initial responses, we'll now ask some additional questions to better understand your situation.</p>
          </div>
        )}
        
        <div className="assessment-header">
          <h1>Mental Health Assessment</h1>
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
            {phase === 'initial' && currentQuestionIndex === convertPreScreeningQuestions().length - 1 
              ? 'Continue to Detailed Assessment' 
              : currentQuestionIndex === allQuestions.length - 1 
                ? 'Complete' 
                : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentPage