"use client";
import React, { useEffect, useState} from 'react'
import { IoIosArrowDropdownCircle } from "react-icons/io"
import { RiLogoutCircleRLine } from "react-icons/ri"
import XmppService from '@/services/xmppService'
import { useXmpp } from '@/contexts/xmppContext'

const Chat = () => {
    const [bgColor, setBgColor] = useState('#2f2f2f')
    const [showPrivateMessages, setShowPrivateMessages] = useState(false)
    const [showChannelMessages, setShowChannelMessages] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { roster, login } = useXmpp();


    
    const handleColorChange = (event) => {
        setBgColor(event.target.value)
    }


    const direct_messages = [
        {
            name: 'John Doe',
            status: 'online',
            messages: [
                {
                    from: 'John Doe',
                    message: 'Hello, how are you?',
                    timestamp: '10:00 AM'
                },
                {
                    from: 'Me',
                    message: 'I am good, thanks for asking',
                    timestamp: '10:01 AM'
                }
            ]
        },
        {
            name: 'Paul Smith',
            status: 'offline',
            messages: [
                {
                    from: 'Paul Smith',
                    message: 'Hey, what are you doing?',
                    timestamp: '10:00 AM'
                },
                {
                    from: 'Me',
                    message: 'Nothing much, just chilling',
                    timestamp: '10:01 AM'
                }
            ]
        }
    ]

    const channel_messages = [
        {
            name: 'General',
            messages: [
                {
                    from: 'John Doe',
                    message: 'Hello, how are you?',
                    timestamp: '10:00 AM'
                },
                {
                    from: 'Me',
                    message: 'I am good, thanks for asking',
                    timestamp: '10:01 AM'
                }
            ]
        },
        {
            name: 'Random',
            messages: [
                {
                    from: 'Paul Smith',
                    message: 'Hey, what are you doing?',
                    timestamp: '10:00 AM'
                },
                {
                    from: 'Me',
                    message: 'Nothing much, just chilling',
                    timestamp: '10:01 AM'
                }
            ]
        }
    ]
    

    useEffect(() => {
        const user = localStorage.getItem('username');
        const pass = localStorage.getItem('password');
        if (user && pass) {
            setUsername(user);
            setPassword(pass);
        }
    }, []);    


    return (
        <div className='page bg-white md:p-10 h-screen relative'>
            {console.log("username", username)}
            <ul>
                {roster.map(contact => (
                    <li key={contact}>
                        {contact}
                    </li>
                ))}
            </ul>
            <input 
                type="color" 
                value={bgColor} 
                onChange={handleColorChange} 
                className="absolute bottom-0 right-0 rounded-md m-2"
            />
            <div className='absolute top-0 right-0 m-4'>
                <RiLogoutCircleRLine className='text-black text-2xl cursor-pointer' />
            </div>
            <div className="mockup-code text-white w-full h-full overflow-y-auto flex" style={{backgroundColor: bgColor}}>
                <div className='bg-transparent text-black rounded-md m-4 w-1/4 shadow-lg overflow-y-scroll'>
                    <span className='text-xl p-4 font-poppins text-white flex justify-start items-center font-semibold'>
                        Direct Messages
                        <IoIosArrowDropdownCircle 
                            className='text-white ml-2 cursor-pointer'
                            onClick={() => setShowPrivateMessages(!showPrivateMessages)}
                        />
                    </span>
                    {
                        showPrivateMessages && messages.map(contact => (
                            <div className='flex items-center justify-between p-2 m-2 bg-gray-200 rounded-xl cursor-pointer' key={contact.name}>
                                <div className='flex items-center'>
                                    <div className='h-8 w-8 bg-green-500 rounded-full'></div>
                                    <div className='ml-2'>{contact.name}</div>
                                </div>
                                <div className='text-sm'>{contact.status}</div>
                            </div>
                        ))
                    }
                    <span className='text-xl p-4 font-poppins text-white flex justify-start items-center font-semibold'>
                        Channels
                        <IoIosArrowDropdownCircle 
                            className='text-white ml-2 cursor-pointer'
                            onClick={() => setShowChannelMessages(!showChannelMessages)}
                        />
                    </span>
                    {
                        showChannelMessages && channel_messages.map(channel => (
                            <div className='flex items-center justify-between p-2 m-2 bg-gray-200 rounded-xl cursor-pointer' key={channel.name}>
                                <div className='flex items-center'>
                                    <div className='h-8 w-8 bg-green-500 rounded-full'></div>
                                    <div className='ml-2'>{channel.name}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='glassmorphism shadow-2xl text-black p-10 rounded-md m-4 w-3/4'>
                </div>
            </div>
        </div>
    )
}

export default Chat