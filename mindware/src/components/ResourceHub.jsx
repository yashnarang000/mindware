import '../styles/ResourceHub.css'

const ResourceHub = () => {
  const resources = [
    {
      id: 1,
      title: "Understanding Anxiety",
      description: "Learn about anxiety disorders, symptoms, and coping strategies.",
      category: "Mental Health",
      type: "Article",
      duration: "8 min read"
    },
    {
      id: 2,
      title: "Mindfulness Meditation Guide",
      description: "A step-by-step guide to practicing mindfulness meditation.",
      category: "Wellness",
      type: "Guide",
      duration: "12 min read"
    },
    {
      id: 3,
      title: "Stress Management Techniques",
      description: "Effective techniques to manage and reduce stress in daily life.",
      category: "Stress",
      type: "Video",
      duration: "15 min"
    },
    {
      id: 4,
      title: "Sleep Hygiene Tips",
      description: "Improve your sleep quality with these evidence-based tips.",
      category: "Sleep",
      type: "Checklist",
      duration: "5 min read"
    },
    {
      id: 5,
      title: "Building Resilience",
      description: "How to develop resilience and bounce back from challenges.",
      category: "Personal Growth",
      type: "Workshop",
      duration: "20 min read"
    },
    {
      id: 6,
      title: "Healthy Communication",
      description: "Improve your relationships with better communication skills.",
      category: "Relationships",
      type: "Guide",
      duration: "10 min read"
    }
  ]

  const categories = ["All", "Mental Health", "Wellness", "Stress", "Sleep", "Personal Growth", "Relationships"]

  return (
    <div className="resource-hub">
      <div className="resource-header">
        <h2>Resource Hub</h2>
        <p>Explore our curated collection of mental health resources</p>
      </div>
      
      <div className="resource-filters">
        <div className="category-filters">
          {categories.map((category) => (
            <button 
              key={category}
              className={`filter-btn ${category === 'All' ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="resources-grid">
        {resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-content">
              <div className="resource-meta">
                <span className="resource-category">{resource.category}</span>
                <span className="resource-type">{resource.type}</span>
              </div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-footer">
                <span className="resource-duration">{resource.duration}</span>
                <button className="btn btn-outline btn-small">View Resource</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResourceHub