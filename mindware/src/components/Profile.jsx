import { useState } from 'react'
import '../styles/Profile.css'

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    anonymousUsername: "CalmMind2024",
    joinDate: "January 15, 2024",
    assessmentsCompleted: 3,
    resourcesViewed: 12,
    communityPosts: 8
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(userData)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setUserData(editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your account settings and preferences</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              <span className="avatar-placeholder">👤</span>
            </div>
            
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editedData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Anonymous Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editedData.anonymousUsername}
                    onChange={(e) => handleInputChange('anonymousUsername', e.target.value)}
                    readOnly
                  />
                  <small className="form-help">
                    This username is used for anonymous interactions
                  </small>
                </div>
                
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className="btn btn-outline" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{userData.name}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{userData.email}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Anonymous Username:</span>
                  <span className="detail-value">{userData.anonymousUsername}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">{userData.joinDate}</span>
                </div>
                
                <button className="btn btn-primary" onClick={handleEdit}>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-stats">
          <h3>My Activity</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <div className="stat-number">{userData.assessmentsCompleted}</div>
                <div className="stat-label">Assessments Completed</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <div className="stat-number">{userData.resourcesViewed}</div>
                <div className="stat-label">Resources Viewed</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <div className="stat-number">{userData.communityPosts}</div>
                <div className="stat-label">Community Posts</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <h3>Account Settings</h3>
          <div className="settings-grid">
            <button className="setting-card">
              <div className="setting-icon">🔒</div>
              <div className="setting-info">
                <h4>Change Password</h4>
                <p>Update your account password</p>
              </div>
            </button>
            
            <button className="setting-card">
              <div className="setting-icon">🔔</div>
              <div className="setting-info">
                <h4>Notification Preferences</h4>
                <p>Manage your notification settings</p>
              </div>
            </button>
            
            <button className="setting-card">
              <div className="setting-icon">🛡️</div>
              <div className="setting-info">
                <h4>Privacy Settings</h4>
                <p>Control your privacy preferences</p>
              </div>
            </button>
            
            <button className="setting-card">
              <div className="setting-icon">🚪</div>
              <div className="setting-info">
                <h4>Logout</h4>
                <p>Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile