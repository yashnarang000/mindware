import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import assessmentData from '../data/data.json'
import QuestionCard from '../components/QuestionCard'
import { assessmentAPI } from '../api'
import '../styles/AssessmentPage.css'

// Convert assessment questions
const convertAssessmentQuestions = (assessmentKey) => {
  const assessment = assessmentData.assessments[assessmentKey];
  if (!assessment) return [];
  
  return assessment.questions.map((q, index) => ({
    id: index + 1,
    question: q,
    options: assessment.options.map((option, optionIndex) => ({
      value: optionIndex.toString(),
      label: option
    }))
  }));
};

const AssessmentTestPage = () => {
  const navigate = useNavigate()
  const { assessmentType } = useParams()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [allQuestions, setAllQuestions] = useState([])
  const [assessmentInfo, setAssessmentInfo] = useState(null)

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

  useEffect(() => {
    // Reset state when assessmentType changes
    setCurrentQuestionIndex(0)
    setAnswers({})
    setAllQuestions([])
    setAssessmentInfo(null)
    
    // Check if we're in crisis mode
    const crisisMode = localStorage.getItem('mindware_crisis_mode') === 'true';
    if (crisisMode && assessmentType === "CRISIS") {
      // If we're in crisis mode and somehow ended up here, redirect to home
      localStorage.setItem('mindware_followup_completed', 'true');
      navigate('/home');
      return;
    }
    
    if (assessmentType && assessmentData.assessments[assessmentType]) {
      const questions = convertAssessmentQuestions(assessmentType)
      setAllQuestions(questions)
      setAssessmentInfo(assessmentData.assessments[assessmentType])
    }
  }, [assessmentType, navigate])

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = async () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Last question reached, save results and move to next assessment or home
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    // Save this assessment results
    const assessmentResults = {
      type: assessmentType,
      answers,
      completedAt: new Date().toISOString(),
      totalQuestions: allQuestions.length
    }
    
    // Get existing assessments from localStorage
    const existingAssessments = JSON.parse(localStorage.getItem('mindware_assessments') || '[]')
    existingAssessments.push(assessmentResults)
    localStorage.setItem('mindware_assessments', JSON.stringify(existingAssessments))
    
    // Save to backend
    try {
      const userData = JSON.parse(localStorage.getItem('mindware_user') || '{}');
      if (userData.id) {
        const response = await assessmentAPI.saveFollowup({
          userId: userData.id,
          assessmentType: assessmentType,
          answers: assessmentResults
        });
        
        // Log the score and severity if available
        if (response.data.score !== undefined) {
          console.log(`Assessment ${assessmentType} score: ${response.data.score}`);
        }
        if (response.data.severity !== undefined) {
          console.log(`Assessment ${assessmentType} severity: ${response.data.severity}`);
        }
      }
    } catch (error) {
      console.error('Failed to save assessment to backend:', error);
    }
    
    // Get triggered assessments
    const triggered = JSON.parse(localStorage.getItem('mindware_triggered_assessments') || '[]')
    const currentIndex = triggered.indexOf(assessmentType)
    
    if (currentIndex < triggered.length - 1) {
      // Navigate to the next triggered assessment
      const nextAssessment = triggered[currentIndex + 1];
      navigate(`/assessment/${nextAssessment}`)
    } else {
      // This was the last assessment, go to home
      // Set follow-up assessments completed flag
      localStorage.setItem('mindware_followup_completed', 'true')
      navigate('/home')
    }
  }

  // Handle the case where assessment is not found
  if (!assessmentInfo && assessmentType !== "CRISIS") {
    return (
      <div className="assessment-page">
        <div className="assessment-container">
          <div className="results-card">
            <div className="results-header">
              <h1>Assessment Complete</h1>
              <p>You have completed all required assessments.</p>
            </div>
            <button 
              className="btn btn-primary btn-large w-100"
              onClick={() => {
                // Get triggered assessments
                const triggered = JSON.parse(localStorage.getItem('mindware_triggered_assessments') || '[]')
                const currentIndex = triggered.indexOf(assessmentType)
                
                if (currentIndex < triggered.length - 1) {
                  // Navigate to the next triggered assessment
                  const nextAssessment = triggered[currentIndex + 1];
                  navigate(`/assessment/${nextAssessment}`)
                } else {
                  // No more assessments, go to home
                  // Set follow-up assessments completed flag
                  localStorage.setItem('mindware_followup_completed', 'true')
                  navigate('/home')
                }
              }}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = allQuestions[currentQuestionIndex]
  const progress = allQuestions.length > 0 ? ((currentQuestionIndex + 1) / allQuestions.length) * 100 : 0

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        <div className="assessment-header">
          <h1>{assessmentInfo?.purpose || 'Assessment'}</h1>
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

export default AssessmentTestPage