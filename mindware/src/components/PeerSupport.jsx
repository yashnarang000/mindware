import { useState, useEffect, useRef } from 'react'
import '../styles/PeerSupport.css'

const PeerSupport = () => {
  const [activeChatType, setActiveChatType] = useState('global') // 'global' or 'friends'
  const [activeFriend, setActiveFriend] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [currentUser] = useState({ username: localStorage.getItem('mindware_user') ? JSON.parse(localStorage.getItem('mindware_user')).username : 'user_a1b2c3' })
  const [websocket, setWebsocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Connect to WebSocket when component mounts or when chat type changes
  useEffect(() => {
    // Close existing connection if any
    if (websocket) {
      websocket.close()
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('mindware_user') 
      ? JSON.parse(localStorage.getItem('mindware_user')) 
      : { username: 'user_a1b2c3' }
    
    const userId = userData.username
    const roomId = activeChatType === 'global' ? 'global' : 'friends'
    
    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:8001/ws/${roomId}/${userId}`)
    
    ws.onopen = () => {
      console.log('Connected to chat server')
      // Request chat history when connecting
      ws.send(JSON.stringify({ type: 'get_history' }))
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'user_list') {
          // Handle user list updates
          setOnlineUsers(data.users)
        } else if (data.type === 'history') {
          // Handle chat history
          setMessages(data.messages || [])
        } else if (data.type === 'private_message') {
          // Handle private messages
          setMessages(prev => [...prev, data])
        } else {
          // Handle new messages
          setMessages(prev => [...prev, data])
        }
      } catch (e) {
        console.error('Error parsing message:', e)
      }
    }
    
    ws.onclose = () => {
      console.log('Disconnected from chat server')
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    setWebsocket(ws)
    
    // Cleanup function
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [activeChatType]) // Reconnect when chat type changes

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !websocket || websocket.readyState !== WebSocket.OPEN) return

    if (activeChatType === 'friends' && activeFriend) {
      // Send private message
      const privateMessage = {
        type: 'private_message',
        text: newMessage,
        recipient_id: activeFriend.username
      }
      
      websocket.send(JSON.stringify(privateMessage))
      setNewMessage('')
    } else {
      // Send regular message
      const message = {
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user_id: currentUser.username,
        room_id: activeChatType === 'global' ? 'global' : 'friends'
      }

      websocket.send(JSON.stringify(message))
      setNewMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Function to start private chat with a user from global chat
  const startPrivateChat = (username) => {
    // Find or create friend object
    const friend = { id: username, username: username, online: true }
    setActiveFriend(friend)
    setActiveChatType('friends')
  }

  return (
    <div className="peer-support">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Peer-to-Peer Support</h2>
          <p>Connect with others on their mental wellness journey</p>
        </div>
        
        {/* Chat Type Selector */}
        <div className="chat-type-selector">
          <button 
            className={`chat-type-btn ${activeChatType === 'global' ? 'active' : ''}`}
            onClick={() => {
              setActiveChatType('global')
              setActiveFriend(null)
            }}
          >
            <span className="btn-icon">🌍</span>
            Global Chat
          </button>
          <button 
            className={`chat-type-btn ${activeChatType === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveChatType('friends')}
          >
            <span className="btn-icon">👤</span>
            Friends
          </button>
        </div>

        <div className="chat-content">
          {/* Friends List (only shown in friends mode) */}
          {activeChatType === 'friends' && (
            <div className="friends-list">
              <div className="friends-header">
                <h3>Friends Online</h3>
                <span className="online-count">{onlineUsers.filter(u => u !== currentUser.username).length}</span>
              </div>
              <div className="friends-items">
                {onlineUsers
                  .filter(u => u !== currentUser.username)
                  .map((username, index) => (
                    <div 
                      key={index}
                      className={`friend-item ${activeFriend?.username === username ? 'active' : ''}`}
                      onClick={() => {
                        const friend = { id: username, username: username, online: true }
                        setActiveFriend(friend)
                      }}
                    >
                      <div className="friend-avatar">
                        <div className="avatar-placeholder-small">{username.charAt(5)}</div>
                        <div className="status-indicator online"></div>
                      </div>
                      <div className="friend-info">
                        <div className="friend-username">{username}</div>
                        <div className="friend-status">Online</div>
                      </div>
                    </div>
                  ))
                }
                {onlineUsers.filter(u => u !== currentUser.username).length === 0 && (
                  <div className="no-friends">
                    <p>No friends online. Start a private chat by clicking on a username in Global Chat.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className="chat-area">
            {/* Chat Header */}
            <div className="chat-room-header">
              {activeChatType === 'global' ? (
                <h3>🌍 Global Chat Room</h3>
              ) : activeFriend ? (
                <div className="friend-chat-header">
                  <div className="friend-avatar-header">
                    <div className="avatar-placeholder-small">{activeFriend.username.charAt(5)}</div>
                    <div className="status-indicator online"></div>
                  </div>
                  <div className="friend-header-info">
                    <h3>👤 {activeFriend.username}</h3>
                    <span className="friend-header-status">Online</span>
                  </div>
                </div>
              ) : (
                <h3>Select a friend to chat</h3>
              )}
            </div>

            {/* Messages Area */}
            <div className="messages-container">
              {messages.length > 0 ? (
                messages
                  .filter(msg => {
                    // Filter messages based on chat type
                    if (activeChatType === 'global') {
                      return msg.room_id === 'global'
                    } else if (activeChatType === 'friends' && activeFriend) {
                      return (
                        (msg.user_id === currentUser.username && msg.recipient_id === activeFriend.username) ||
                        (msg.user_id === activeFriend.username && msg.recipient_id === currentUser.username) ||
                        msg.type === 'private_message' && (
                          (msg.user_id === currentUser.username && msg.recipient_id === activeFriend.username) ||
                          (msg.user_id === activeFriend.username && msg.recipient_id === currentUser.username)
                        )
                      )
                    }
                    return false
                  })
                  .map((message, index) => (
                    <div 
                      key={index} 
                      className={`message ${message.user_id === currentUser.username ? 'sent' : 'received'}`}
                    >
                      {message.user_id !== currentUser.username && activeChatType === 'global' && (
                        <div 
                          className="message-author"
                          onClick={() => startPrivateChat(message.user_id)}
                          title="Click to start private chat"
                        >
                          {message.user_id}
                        </div>
                      )}
                      <div className="message-content">
                        <div className="message-text">{message.text || message.content}</div>
                        <div className="message-time">{message.timestamp}</div>
                      </div>
                    </div>
                  ))
              ) : activeChatType === 'friends' && activeFriend ? (
                <div className="no-messages">
                  <p>No messages yet. Start a conversation with {activeFriend.username}!</p>
                </div>
              ) : activeChatType === 'global' ? (
                <div className="no-messages">
                  <p>No messages in the global chat yet. Be the first to start a conversation!</p>
                </div>
              ) : (
                <div className="no-messages">
                  <p>Select a friend to start chatting</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {(activeChatType === 'global' || (activeChatType === 'friends' && activeFriend)) && (
              <div className="message-input-container">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={activeChatType === 'global' 
                    ? 'Type a message to the global chat...' 
                    : `Message ${activeFriend?.username}...`}
                  className="message-input"
                  rows="2"
                />
                <div className="message-actions">
                  <div className="input-info">
                    <span>Anonymous: {currentUser.username}</span>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    className="btn btn-primary"
                    disabled={newMessage.trim() === ''}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="community-stats">
        <div className="stat-item">
          <span className="stat-number">{onlineUsers.length + 1247}</span>
          <span className="stat-label">Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{onlineUsers.length}</span>
          <span className="stat-label">Online</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24</span>
          <span className="stat-label">Support Groups</span>
        </div>
      </div>
    </div>
  )
}

export default PeerSupport