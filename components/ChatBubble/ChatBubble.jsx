import React from 'react'

const ChatBubble = ({ message, type , timestamp }) => {

  const isImage = message.startsWith('http') && message.endsWith('.jpg' || '.png')
  const isLink = message.startsWith('http') && !message.endsWith('.jpg' || '.png')

  return (
    <div className={`chat ${type === 'sent' ? 'chat-end w-80' : 'chat-start w-80'}`}>
    <div className="chat-bubble bg-white w-80">
        <div className="chat-content flex flex-col">
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
              {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
        </div>
    </div>
    </div>
  )
}

export default ChatBubble