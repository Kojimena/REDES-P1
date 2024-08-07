"use client";
import React, { use, useEffect, useState} from 'react'
import { IoIosArrowDropdownCircle } from "react-icons/io"
import { RiLogoutCircleRLine } from "react-icons/ri"
import { useXmpp } from '@/contexts/xmppContext'
import { MdCancel } from "react-icons/md";
import { useRouter } from 'next/navigation'
import ChatBubble from '@/components/ChatBubble/ChatBubble'
import { FiSend } from "react-icons/fi"
import { FaUserFriends } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"
import ProfilePopup from '@/components/ProfilePopup/ProfilePopup';



const Chat = () => {
    const [bgColor, setBgColor] = useState('#2f2f2f')
    const [showPrivateMessages, setShowPrivateMessages] = useState(false)
    const [showChannelMessages, setShowChannelMessages] = useState(false)
    const [showInvitations, setShowInvitations] = useState(false)
    const { xmpp, invitations, logout, alreadyLogged, conversationsUpdate, roster, myPresence, contactStatus } = useXmpp();

    const [toMessage, setToMessage] = useState('');
    const [messagetoSend, setMessageToSend] = useState('');
    const [privateMessage , setPrivateMessage] = useState('');


    const [showPopupMessage, setShowPopupMessage] = useState(false);
    const rout = useRouter();

    const [conversations, setConversations] = useState({});
    const [selectedContact, setSelectedContact] = useState(null);


    const [viewContacts, setViewContacts] = useState(false);

    const [profilePopup, setProfilePopup] = useState(false);


    /*chats*/
    useEffect(() => {
        setConversations(conversationsUpdate);
    }, [conversationsUpdate]);

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    const renderMessages = (contact) => {
        const messages = conversations[contact];
        if (selectedContact === contact) {
            return messages.map((message, index) => (
                <div className='flex justify-start items-center p-2' key={index}>
                    <div className='h-8 w-8 bg-black rounded-full flex justify-center items-center'>
                        <span className='text-white text-sm font-semibold uppercase'>{contact[0]}</span>
                    </div>
                    <ChatBubble  message={message} />
                </div>

            ));
        }
        return null;  // null when not selected to prevent rendering in contact list
    };
    
    


    
    const handleColorChange = (event) => {
        setBgColor(event.target.value)
    }

    /*Mensajes privados*/
    const onChangeMessage = (event) => {
        setMessageToSend(event.target.value);
    }

    const onChangePrivateMessage = (event) => {
        console.log(event.target.value);
        setPrivateMessage(event.target.value);
    }

    const handleShowPopupMessage = () => {
        setShowPopupMessage(!showPopupMessage)
    }

    const handleSendMessage = () => {
        xmpp.sendMessage(toMessage, messagetoSend);
        setShowPopupMessage(false);
    }


    /*logout*/
    const handleLogout = () => {
        logout(localStorage.getItem('username'), localStorage.getItem('password'));
        setTimeout(() => {
            rout.push('/');
        }, 2000);
    }

    /*contacts*/
    const handleViewContacts = () => {
        xmpp.getRoster();
        setViewContacts(!viewContacts);
    }

    /*profile*/
    const handleProfilePopup = () => {
        setProfilePopup(!profilePopup);
    }



    // If user is already logged
    useEffect(() => {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        if (!alreadyLogged && username && password) {
            rout.push('/');
        }
    }, [])
    

    return (
        <div className='page bg-white md:p-10 h-screen relative md:flex md:flex-col md:justify-end'>
            <input 
                type="color" 
                value={bgColor} 
                onChange={handleColorChange} 
                className="absolute bottom-0 right-0 rounded-md m-2"
            />
            <div className='absolute top-0 right-0 m-4 flex gap-4'>
                <CgProfile className='text-black text-2xl cursor-pointer' onClick={handleProfilePopup} />
                <FaUserFriends className='text-black text-2xl cursor-pointer' onClick={handleViewContacts} />
                <RiLogoutCircleRLine className='text-black text-2xl cursor-pointer' onClick={handleLogout} />
            </div>
            <div className="mockup-code text-white w-full h-[98%] flex md:flex-row flex-col" style={{backgroundColor: bgColor}}>
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
                                    <button className='bg-black text-white p-2 rounded-md ml-2' onClick={() => xmpp.acceptInvitation(invite)}> 
                                        Accept
                                    </button>
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
                    {showPrivateMessages && Object.keys(conversations).map(contact => (
                            <div className='flex items-start justify-center flex-col bg-white p-2 mb-2 rounded-xl' key={contact} onClick={() => handleSelectContact(contact)}>
                                <span className='font-bold text-sm'>{contact.split('@')[0]}</span>
                                <span className='text-xs'>{conversations[contact][conversations[contact].length - 1]}</span>
                            </div>
                    ))}
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
                <div className='glassmorphism shadow-2xl text-black p-10 rounded-md m-4 md:w-3/4 h-full md:h-[98%] md:m-4 md:p-0 relative'>
                    <div className='h-[96%] overflow-y-auto'>
                        {selectedContact && renderMessages(selectedContact)}
                    </div>
                    <div className='fixed bottom-0 w-full flex justify-end'>
                        <input 
                            type='text' 
                            placeholder='Message' 
                            className='p-2 rounded-md bg-white border border-gray-300 w-full'
                            value={privateMessage}
                            onChange={onChangePrivateMessage}
                        />
                        <button className='bg-black text-white p-2 rounded-md ml-2' onClick={() => xmpp.sendMessage(selectedContact, privateMessage)}>
                            <FiSend />
                        </button>
                    </div>
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
            {
                viewContacts && (
                    <div className='fixed inset-0 w-80 m-4 bg-white p-4 rounded-md shadow-lg'>
                        <span className='text-md p-4 font-poppins text-black flex justify-center items-center font-semibold'>
                            Contacts
                        </span>
                        <button  className='absolute top-0 right-0' onClick={handleViewContacts}>
                            <MdCancel  className='text-black text-2xl cursor-pointer' />
                        </button>
                        {
                            roster.map(contact => (
                                <div className='flex items-center justify-between p-2 m-2 bg-gray-200 rounded-xl cursor-pointer' key={contact}>
                                    <div className='flex items-center'>
                                        <div className='h-8 w-8 bg-black rounded-full'></div>
                                        <div className='ml-2 flex flex-col'>
                                            <span className='font-medium text-black'>{contact}</span>
                                            <span>status: {contactStatus[contact] ? contactStatus[contact] : 'offline'} </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            console.log(contactStatus)
                        }
                    </div>
                )
            }
            {
                profilePopup && (
                    <ProfilePopup presence={myPresence} xmpp={xmpp} />
                )
            }
        </div>
    )
}

export default Chat