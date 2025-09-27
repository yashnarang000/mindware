import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Only show navbar on landing page
  const isLandingPage = location.pathname === '/'

  if (!isLandingPage) {
    return null
  }

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-brand" onClick={() => navigate('/')}>
          MindWare
        </div>
        <div className="nav-actions">
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/signup')}
          >
            Try for Free
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar