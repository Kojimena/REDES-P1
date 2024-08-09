import React from 'react'

const ChatBubble = ({ message, type }) => {

  const isImage = message.startsWith('http') && message.endsWith('.jpg' || '.png')
  const isLink = message.startsWith('http') && !message.endsWith('.jpg' || '.png')

  return (
    <div className={`chat ${type === 'sent' ? 'chat-end w-full' : 'chat-start'}`}>
    <div className="chat-bubble bg-white">
        <div className="chat-content">
              {isImage ? <img src={message} alt="img" className="w-80 h-96 object-contain" /> : isLink ? 
              <div className='flex flex-col h-96'>
                <iframe 
                style={{border: 'none', margin: '0 auto', borderRadius: '10px', width: '100%', height: '400px'}}
                src={
                message.includes('youtube') ? message.replace('watch?v=', 'embed/') : message
              } title="video" className=""></iframe>
                <a href={message} target="_blank" rel="noreferrer" className="text-blue-500">Go to the link</a>
              </div>
              : 
              <span className="text-gray-800">{message}</span>}
        </div>
    </div>
    </div>
  )
}

export default ChatBubble