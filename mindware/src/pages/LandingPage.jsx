import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    })
    alert('Thank you for your message! We will get back to you soon.')
  }

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Path to Mental Wellness</h1>
            <p className="hero-subtitle">
              Join thousands who have discovered their journey to better mental health 
              with our comprehensive assessment and support platform.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">About MindWare</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                MindWare is a comprehensive mental health platform designed to provide 
                personalized assessments, resources, and support for individuals on their 
                mental wellness journey.
              </p>
              <p>
                Our platform combines evidence-based assessments with AI-powered insights 
                to help you understand your mental health patterns and connect with 
                appropriate resources and support.
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>Smart Assessment</h3>
                <p>Comprehensive mental health evaluation tailored to your needs</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>AI Support</h3>
                <p>24/7 AI chatbot for immediate guidance and emotional support</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Community</h3>
                <p>Connect with peers and mental health professionals</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Resources</h3>
                <p>Curated content and tools for mental wellness</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span>support@mindware.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Address:</span>
                <span>123 Wellness Street, Mental Health City, MH 12345</span>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Your name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="Your email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea 
                    className="form-input" 
                    rows="5" 
                    placeholder="Your message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 MindWare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage