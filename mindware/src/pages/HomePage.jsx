import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AIChatbot from '../components/AIChatbot'
import ResourceHub from '../components/ResourceHub'
import PeerSupport from '../components/PeerSupport'
import CounselorSupport from '../components/CounselorSupport'
import Profile from '../components/Profile'
import '../styles/HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('ai-chatbot')
  const [assessmentResults, setAssessmentResults] = useState(null)

  useEffect(() => {
    // Load assessment results from localStorage
    const savedAssessments = localStorage.getItem('mindware_assessments')
    if (savedAssessments) {
      try {
        const assessments = JSON.parse(savedAssessments)
        setAssessmentResults(assessments)
      } catch (e) {
        console.error('Failed to parse assessment results', e)
      }
    }
    
    // Listen for custom event to set active section
    const handleSetActiveSection = (event) => {
      setActiveSection(event.detail);
    };
    
    window.addEventListener('setActiveSection', handleSetActiveSection);
    
    return () => {
      window.removeEventListener('setActiveSection', handleSetActiveSection);
    };
  }, [])

  const handleRetest = () => {
    // Get triggered assessments
    const triggered = JSON.parse(localStorage.getItem('mindware_triggered_assessments') || '[]')
    
    if (triggered.length > 0) {
      // Navigate to the first triggered assessment
      navigate(`/assessment/${triggered[0]}`)
    } else {
      // Clear assessments and go to initial assessment
      localStorage.removeItem('mindware_assessments')
      localStorage.removeItem('mindware_followup_completed')
      navigate('/initial-assessment')
    }
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'ai-chatbot':
        return <AIChatbot assessmentResults={assessmentResults} />
      case 'resource-hub':
        return <ResourceHub />
      case 'peer-support':
        return <PeerSupport />
      case 'counselor-support':
        return <CounselorSupport />
      case 'profile':
        return <Profile />
      default:
        return <AIChatbot assessmentResults={assessmentResults} />
    }
  }

  return (
    <div className="home-page">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <main className="main-content">
        <div className="main-header">
          <h1>
            {activeSection === 'ai-chatbot' && 'AI Chatbot'}
            {activeSection === 'resource-hub' && 'Resource Hub'}
            {activeSection === 'peer-support' && 'Peer-to-Peer Support'}
            {activeSection === 'counselor-support' && 'Counselor Support'}
            {activeSection === 'profile' && 'My Profile'}
          </h1>
          <button 
            className="complete-tests-btn"
            onClick={handleRetest}
          >
            Retest
          </button>
        </div>
        
        <div className="content-container">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  )
}

export default HomePage