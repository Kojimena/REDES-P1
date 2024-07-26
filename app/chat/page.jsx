"use client";
import React, {useState} from 'react'

const Chat = () => {
    const [bgColor, setBgColor] = useState('#2f2f2f');
    
    const handleColorChange = (event) => {
        setBgColor(event.target.value);
    };
    
    return (
        <div className='page bg-white md:p-20 h-screen relative'>
            <input 
                type="color" 
                value={bgColor} 
                onChange={handleColorChange} 
                className="absolute top-0 right-0 rounded-md m-2"
            />
            <div className="mockup-code text-white w-full h-full overflow-y-auto" style={{backgroundColor: bgColor}}>
                <pre><code>chat</code></pre>
            </div>
        </div>
    )
}

export default Chat