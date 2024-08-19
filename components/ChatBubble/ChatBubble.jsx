import React from 'react';

const ChatBubble = ({ message, type, timestamp }) => {
    console.log('message:', message);

    // Función para determinar si el mensaje es una imagen
    const isImage = (url) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(url);
    };

    // Función para determinar si el mensaje es un enlace
    const isLink = (url) => {
        return /^http/.test(url) && !isImage(url);
    };

    return (
        <div className={`chat ${type === 'sent' ? 'chat-end w-80' : 'chat-start w-80'}`}>
            <div className="chat-bubble bg-white w-80">
                <div className="chat-content flex flex-col">
                    {isImage(message) && <img src={message} alt="content" className="w-80 h-96 object-contain" />}
                    {isLink(message) && 
                        <div className='flex flex-col h-96'>
                            <iframe
                                style={{border: 'none', margin: '0 auto', borderRadius: '10px', width: '100%', height: '400px'}}
                                src={message.includes('youtube') ? message.replace('watch?v=', 'embed/') : message}
                                title="video"
                                className="">
                            </iframe>
                            <a href={message} target="_blank" rel="noreferrer" className="text-blue-500">Go to the link</a>
                        </div>
                    }
                    {!isImage(message) && !isLink(message) && 
                        <span className="text-gray-800">{message}</span>
                    }
                    {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;