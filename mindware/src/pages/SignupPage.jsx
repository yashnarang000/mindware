import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { authAPI } from '../api'
import '../styles/SignupPage.css'

const SignupPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    name: '',
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
    if (!formData.email || !formData.name || !formData.password) {
      alert('Please fill in all fields')
      return
    }
    
    try {
      // Call backend API to signup
      const response = await authAPI.signup(formData)
      
      // Check if user already exists
      if (response.data.msg === "User already exists") {
        alert('already a user plz login')
        navigate('/login')
        return
      }
      
      // Save user data to localStorage
      const userData = {
        ...formData,
        id: response.data.userId || Date.now(),
        username: response.data.username,
        registeredAt: new Date().toISOString(),
        initialAssessmentCompleted: response.data.initialAssessmentCompleted,
        followupAssessmentsCompleted: response.data.followupAssessmentsCompleted
      }
      
      localStorage.setItem('mindware_user', JSON.stringify(userData))
      
      // Navigate to initial assessment
      navigate('/initial-assessment')
    } catch (error) {
      console.error('Signup error:', error)
      alert('Signup failed. Please try again.')
    }
  }

  return (
    <div className="signup-page">
      <Navbar />
      
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Join MindWare</h1>
            <p>Start your mental wellness journey today</p>
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
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your full name"
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
                placeholder="Create a secure password"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-100 signup-btn">
              Create Account & Start Assessment
            </button>
          </form>
          
          <div className="signup-footer">
            <p>
              Already have an account? 
              <span className="login-link" onClick={() => navigate('/login')}>
                Sign in here
              </span>
            </p>
          </div>
        </div>
        
        <div className="signup-benefits">
          <h3>What you'll get:</h3>
          <ul>
            <li>
              <span className="benefit-icon">✓</span>
              Personalized mental health assessment
            </li>
            <li>
              <span className="benefit-icon">✓</span>
              24/7 AI support and guidance
            </li>
            <li>
              <span className="benefit-icon">✓</span>
              Access to curated resources
            </li>
            <li>
              <span className="benefit-icon">✓</span>
              Anonymous peer support community
            </li>
            <li>
              <span className="benefit-icon">✓</span>
              Professional counselor connections
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SignupPage