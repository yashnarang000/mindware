import { useState, useEffect } from 'react'
import '../styles/AIChatbot.css'

const AIChatbot = ({ assessmentResults }) => {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    // Initialize with a welcome message
    const initialMessages = [
      {
        id: 1,
        text: "Hello! I'm your MindWare AI assistant. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      }
    ]
    
    // If we have assessment results, add a personalized message
    if (assessmentResults && assessmentResults.length > 0) {
      initialMessages.push({
        id: 2,
        text: `I see you've recently completed ${assessmentResults.length} mental health assessments. I'm here to support you based on your responses.`,
        sender: 'ai',
        timestamp: new Date()
      })
    }
    
    setMessages(initialMessages)
  }, [assessmentResults])

  const handleSend = () => {
    if (inputText.trim() === '') return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "I understand how you're feeling. It's important to acknowledge these emotions.",
        "That's a great point. Have you tried any relaxation techniques?",
        "Your mental health is important. Remember to take breaks when you need them.",
        "It sounds like you're going through a lot. Would you like to talk more about this?",
        "I'm here to support you. What would make you feel better right now?"
      ]
      
      // If we have assessment results, we could personalize responses further
      if (assessmentResults && assessmentResults.length > 0) {
        aiResponses.push(
          "Based on your recent assessments, I recommend checking out our stress management resources.",
          "I noticed some concerns in your assessments. Would you like some coping strategies?",
          "Your assessment responses suggest you might benefit from our mindfulness exercises."
        )
      }
      
      const aiMessage = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="ai-chatbot">
      <div className="chat-container">
        <div className="chat-header">
          <h2>🧠 MindWare AI Assistant</h2>
          <p>Your 24/7 mental wellness companion</p>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="message-input"
          />
          <button 
            onClick={handleSend}
            className="send-button"
            disabled={inputText.trim() === ''}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIChatbot