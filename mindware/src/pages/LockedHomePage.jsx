import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import CounselorSupport from '../components/CounselorSupport'
import '../styles/HomePage.css'

const LockedHomePage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('ai-chatbot') // Default to AI chatbot for normal mode
  const [isCrisisMode, setIsCrisisMode] = useState(false)

  // Check if we're in crisis mode when component mounts
  useEffect(() => {
    const crisisMode = localStorage.getItem('mindware_crisis_mode') === 'true';
    setIsCrisisMode(crisisMode);
    
    // If in crisis mode, default to counselor support section
    if (crisisMode) {
      setActiveSection('counselor-support');
    }
  }, []);

  const handleCompleteProfile = () => {
    // Remove crisis mode flag when starting assessments
    localStorage.removeItem('mindware_crisis_mode');
    setIsCrisisMode(false);
    
    // Get triggered assessments
    const triggered = JSON.parse(localStorage.getItem('mindware_triggered_assessments') || '[]')
    
    // For all cases, navigate to assessments
    if (triggered.length > 0) {
      // Navigate to the first triggered assessment
      const firstAssessment = triggered[0];
      navigate(`/assessment/${firstAssessment}`)
    } else {
      // No follow-up assessments needed, but we still need to mark as completed
      // Set follow-up assessments completed flag
      localStorage.setItem('mindware_followup_completed', 'true')
      navigate('/home')
    }
  }

  const renderLockedSection = () => {
    // In crisis mode, show counselor support content with complete profile button
    if (isCrisisMode && activeSection === 'counselor-support') {
      return (
        <div className="crisis-content">
          <CounselorSupport />
          <div className="complete-profile-container">
            <button 
              className="btn btn-primary"
              onClick={handleCompleteProfile}
            >
              Complete Profile
            </button>
          </div>
        </div>
      );
    }
    
    // For all other sections in crisis mode or normal mode, show locked content
    return (
      <div className="locked-content">
        <h2>Feature Locked</h2>
        <p>Complete your profile and assessments to unlock this feature.</p>
        <button 
          className="btn btn-primary"
          onClick={handleCompleteProfile}
        >
          Complete Profile
        </button>
      </div>
    )
  }

  // Determine which sections should be accessible
  const isSectionAccessible = (section) => {
    // In crisis mode, only counselor support is accessible
    if (isCrisisMode) {
      return section === 'counselor-support';
    }
    // In normal mode, all sections are locked
    return false;
  }

  return (
    <div className="home-page">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        isSectionAccessible={isSectionAccessible} // Pass accessibility info to sidebar
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
            onClick={handleCompleteProfile}
          >
            Complete Profile
          </button>
        </div>
        
        <div className="content-container">
          {renderLockedSection()}
        </div>
      </main>
    </div>
  )
}

export default LockedHomePage