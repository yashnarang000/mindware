import { useState } from 'react'
import '../styles/Sidebar.css'

const Sidebar = ({ activeSection, onSectionChange, isSectionAccessible }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'ai-chatbot', label: 'AI Chatbot', icon: '🤖' },
    { id: 'resource-hub', label: 'Resource Hub', icon: '📚' },
    { id: 'peer-support', label: 'Peer-to-Peer', icon: '👥' },
    { id: 'counselor-support', label: 'Counselor Support', icon: '👨‍⚕️' }
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleSectionChange = (sectionId) => {
    // If accessibility function is provided, check if section is accessible
    if (isSectionAccessible) {
      if (isSectionAccessible(sectionId)) {
        onSectionChange(sectionId);
        setIsOpen(false);
        return;
      }
      // If not accessible, don't change section
      return;
    }
    
    // Default behavior if no accessibility function provided
    onSectionChange(sectionId);
    setIsOpen(false);
  }

  return (
    <>
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        ☰
      </button>
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>MindWare</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeSection === item.id ? 'active' : ''} ${isSectionAccessible && !isSectionAccessible(item.id) ? 'disabled' : ''}`}
                  onClick={() => handleSectionChange(item.id)}
                  disabled={isSectionAccessible && !isSectionAccessible(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''} ${isSectionAccessible && !isSectionAccessible('profile') ? 'disabled' : ''}`}
            onClick={() => handleSectionChange('profile')}
            disabled={isSectionAccessible && !isSectionAccessible('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  )
}

export default Sidebar