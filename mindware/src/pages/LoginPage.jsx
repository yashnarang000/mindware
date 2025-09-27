import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { authAPI } from '../api'
import '../styles/SignupPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields')
      return
    }
    
    try {
      // Call backend API to login
      const response = await authAPI.login(formData)
      
      // Save user data to localStorage
      const userData = {
        email: formData.email,
        token: response.data.token,
        username: response.data.username,
        id: response.data.userId,
        loggedInAt: new Date().toISOString(),
        initialAssessmentCompleted: response.data.initialAssessmentCompleted,
        followupAssessmentsCompleted: response.data.followupAssessmentsCompleted
      }
      
      localStorage.setItem('mindware_user', JSON.stringify(userData))
      
      // Redirect returning users directly to home page
      if (response.data.initialAssessmentCompleted && response.data.followupAssessmentsCompleted) {
        navigate('/home')
      } else if (response.data.initialAssessmentCompleted) {
        // If initial assessment is completed but follow-up is not, go to locked home
        navigate('/locked-home')
      } else {
        // If neither is completed, go to initial assessment
        navigate('/initial-assessment')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Invalid email or password')
    }
  }

  return (
    <div className="signup-page">
      <Navbar />
      
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your mental wellness journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-100 signup-btn">
              Sign In
            </button>
          </form>
          
          <div className="signup-footer">
            <p>
              Don't have an account? 
              <span className="login-link" onClick={() => navigate('/signup')}>
                Sign up here
              </span>
            </p>
          </div>
        </div>
        
        <div className="signup-benefits">
          <h3>Continue Your Journey:</h3>
          <ul>
            <li>
              <span className="benefit-icon">✓</span>
              Pick up where you left off
            </li>
            <li>
              <span className="benefit-icon">✓</span>
              Access your previous assessments
            </li>
            <li>
              <span className="benefit-icon">✓</span>
              Continue receiving personalized recommendations
            </li>
            <li>
              <span className="benefit-icon">✓</span>
              Connect with your support community
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LoginPage