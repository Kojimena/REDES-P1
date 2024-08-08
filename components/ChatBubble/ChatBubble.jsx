import React from 'react'

const ChatBubble = ({ message, type }) => {
  return (
    <div className={`chat ${type === 'sent' ? 'chat-end w-full' : 'chat-start'}`}>
    <div className="chat-bubble bg-white">
        <div className="chat-content">
            <p className='text-black'> {message} </p>
        </div>
    </div>
    </div>
  )
}

export default ChatBubble