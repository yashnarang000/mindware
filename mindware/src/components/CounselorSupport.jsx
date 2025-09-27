import '../styles/CounselorSupport.css'

const CounselorSupport = () => {
  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression",
      experience: "12 years",
      rating: 4.9,
      sessions: 245,
      image: "👩‍⚕️"
    },
    {
      id: 2,
      name: "Michael Chen",
      specialty: "Stress Management",
      experience: "8 years",
      rating: 4.8,
      sessions: 189,
      image: "👨‍⚕️"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Trauma & PTSD",
      experience: "15 years",
      rating: 4.9,
      sessions: 312,
      image: "👩‍⚕️"
    },
    {
      id: 4,
      name: "James Wilson",
      specialty: "Relationship Counseling",
      experience: "10 years",
      rating: 4.7,
      sessions: 156,
      image: "👨‍⚕️"
    }
  ]

  return (
    <div className="counselor-support">
      <div className="counselor-header">
        <h2>Professional Counselor Support</h2>
        <p>Connect with licensed mental health professionals</p>
      </div>
      
      <div className="counselor-search">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by specialty, name, or location..."
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
        
        
        <div className="filter-options">
          <select className="filter-select">
            <option>All Specialties</option>
            <option>Anxiety & Depression</option>
            <option>Stress Management</option>
            <option>Trauma & PTSD</option>
            <option>Relationship Counseling</option>
          </select>
          
          <select className="filter-select">
            <option>Any Experience</option>
            <option>5+ Years</option>
            <option>10+ Years</option>
            <option>15+ Years</option>
          </select>
          
          <select className="filter-select">
            <option>Any Rating</option>
            <option>4.5+ Stars</option>
            <option>4.8+ Stars</option>
          </select>
        </div>
      </div>
      
      <div className="counselors-grid">
        {counselors.map((counselor) => (
          <div key={counselor.id} className="counselor-card">
            <div className="counselor-image">
              <span className="counselor-avatar">{counselor.image}</span>
            </div>
            <div className="counselor-info">
              <h3 className="counselor-name">{counselor.name}</h3>
              <p className="counselor-specialty">{counselor.specialty}</p>
              <div className="counselor-details">
                <span className="detail-item">
                  <span className="detail-label">Experience:</span>
                  {counselor.experience}
                </span>
                <span className="detail-item">
                  <span className="detail-label">Rating:</span>
                  <span className="rating">
                    {counselor.rating} ⭐
                  </span>
                </span>
                <span className="detail-item">
                  <span className="detail-label">Sessions:</span>
                  {counselor.sessions}
                </span>
              </div>
              <button className="btn btn-primary w-100">
                Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="support-info">
        <h3>Need Immediate Support?</h3>
        <div className="emergency-contacts">
          <div className="contact-card">
            <h4>National Suicide Prevention Lifeline</h4>
            <p className="contact-number">988</p>
            <p>24/7 free and confidential support</p>
          </div>
          <div className="contact-card">
            <h4>Crisis Text Line</h4>
            <p className="contact-number">Text HOME to 741741</p>
            <p>24/7 crisis support via text</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CounselorSupport