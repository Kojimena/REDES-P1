"use client";
import React, { useEffect, useState} from 'react'
import { IoIosArrowDropdownCircle } from "react-icons/io"
import { RiLogoutCircleRLine } from "react-icons/ri"
import { useXmpp } from '@/contexts/xmppContext'
import { MdCancel } from "react-icons/md";


const Chat = () => {
    const [bgColor, setBgColor] = useState('#2f2f2f')
    const [showPrivateMessages, setShowPrivateMessages] = useState(false)
    const [showChannelMessages, setShowChannelMessages] = useState(false)
    const [showInvitations, setShowInvitations] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { roster, login, xmpp, invitations } = useXmpp();

    const [toMessage, setToMessage] = useState('');
    const [messagetoSend, setMessageToSend] = useState('');
    const [showPopupMessage, setShowPopupMessage] = useState(false);


    
    const handleColorChange = (event) => {
        setBgColor(event.target.value)
    }

    /*Mensajes privados*/
    const onChangeMessage = (event) => {
        setMessageToSend(event.target.value);
    }

    const handleShowPopupMessage = () => {
        setShowPopupMessage(!showPopupMessage)
    }

    const handleSendMessage = () => {
        xmpp.sendMessage(toMessage, messagetoSend);
    }





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
            <input 
                type="color" 
                value={bgColor} 
                onChange={handleColorChange} 
                className="absolute bottom-0 right-0 rounded-md m-2"
            />
            <div className='absolute top-0 right-0 m-4'>
                <RiLogoutCircleRLine className='text-black text-2xl cursor-pointer' />
            </div>
            <div className="mockup-code text-white w-full h-full overflow-y-auto flex md:flex-row flex-col" style={{backgroundColor: bgColor}}>
                <div className='bg-transparent text-black rounded-md m-4 md:w-1/4 shadow-lg overflow-y-scroll'>
                <span className='text-md p-4 font-poppins text-white flex justify-start items-center font-semibold'>
                        Invitations
                        <div className='gap-4 flex justify-center items-center'>
                            <IoIosArrowDropdownCircle 
                                className='text-white ml-2 cursor-pointer'
                                onClick={() => setShowInvitations(!showInvitations)}
                            />
                        </div>
                    </span>
                    {
                       showInvitations && invitations.map(invite => (
                            <div className='flex items-center justify-between p-2 m-2 bg-gray-200 rounded-xl cursor-pointer' key={invite}>
                                <div className='flex items-center'>
                                    <div className='ml-2'>{invite}</div>
                                </div>
                            </div>
                        ))
                    }
                    <span className='text-md p-4 font-poppins text-white flex justify-start items-center font-semibold'>
                        Direct Messages
                        <div className='gap-4 flex justify-center items-center'>
                            <IoIosArrowDropdownCircle 
                                className='text-white ml-2 cursor-pointer'
                                onClick={() => setShowPrivateMessages(!showPrivateMessages)}
                            />
                            <button onClick={handleShowPopupMessage}>
                                +
                            </button>
                        </div>
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
                    <span className='text-md p-4 font-poppins text-white flex justify-start items-center font-semibold'>
                        Channels
                        <div className='gap-4 flex justify-center items-center'>
                            <IoIosArrowDropdownCircle 
                                className='text-white ml-2 cursor-pointer'
                                onClick={() => setShowChannelMessages(!showChannelMessages)}
                            />
                            <button>
                                +
                            </button>
                        </div>
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
                <div className='glassmorphism shadow-2xl text-black p-10 rounded-md m-4 md:w-3/4 h-full md:h-[98%] md:m-4 md:p-0'>
                </div>
            </div>
            {
                showPopupMessage && (
                    <div className='fixed inset-0 w-80 m-4  bg-white p-4 rounded-md shadow-lg'>
                        <span className='text-md p-4 font-poppins text-black flex justify-center items-center font-semibold'>
                            Send Message
                        </span>
                        <button  className='absolute top-0 right-0' onClick={handleShowPopupMessage}>
                            <MdCancel  className='text-black text-2xl cursor-pointer' />
                        </button>
                        <input 
                            type='text' 
                            placeholder='To' 
                            value={toMessage} 
                            onChange={(e) => setToMessage(e.target.value)}
                            className='w-full p-2 rounded-md bg-gray-800 my-4'
                        />
                        <textarea 
                            placeholder='Message' 
                            className='w-full p-2 rounded-md border bg-gray-800 border-gray-300 my-2'
                            value={messagetoSend}
                            onChange={onChangeMessage}
                        />
                        <button className='bg-black text-white p-2 rounded-md mt-2 w-full' onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default Chat