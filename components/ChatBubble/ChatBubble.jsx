import React from 'react'

const ChatBubble = ({ message }) => {
  return (
    <div className="chat chat-start">
    <div className="chat-bubble bg-white">
        <div className="chat-content">
            <p className='text-black'> {message} </p>
        </div>
    </div>
    </div>
  )
}

export default ChatBubble