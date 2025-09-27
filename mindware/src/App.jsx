import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import InitialAssessmentPage from './pages/InitialAssessmentPage'
import AssessmentTestPage from './pages/AssessmentTestPage'
import HomePage from './pages/HomePage'
import LockedHomePage from './pages/LockedHomePage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/initial-assessment" element={<InitialAssessmentPage />} />
          <Route path="/assessment/:assessmentType" element={<AssessmentTestPage />} />
          <Route path="/locked-home" element={<LockedHomePage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App