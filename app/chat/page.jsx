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
import ProfilePopup from '@/components/ProfilePopup/ProfilePopup'
import ContactPopup from '@/components/ContactPopup/ContactPopup'
import { AiTwotoneDelete } from "react-icons/ai"
import FileUploader from '@/components/FileUploader/FileUploader'
import { IoNotifications } from "react-icons/io5"
import NotificationsPopUp from '@/components/NotificationsPopUp/NotificationsPopUp'
import ChannelCreate from '@/components/ChannelCreate/ChannelCreate'
import { FaPeopleRoof } from "react-icons/fa6"



const Chat = () => {
    const [bgColor, setBgColor] = useState('#2f2f2f')
    const [showPrivateMessages, setShowPrivateMessages] = useState(false)
    const [showChannelMessages, setShowChannelMessages] = useState(false)
    const [showInvitations, setShowInvitations] = useState(false)
    const { xmpp, 
        invitations, 
        logout, alreadyLogged, 
        conversationsUpdate, 
        roster, myPresence, 
        contactStatus, 
        login, 
        grupalInvitations, 
        grupalConversations, 
        myStatus,
        publicRooms,
        notification } = useXmpp();

    const [toMessage, setToMessage] = useState('');
    const [messagetoSend, setMessageToSend] = useState('');
    const [privateMessage , setPrivateMessage] = useState('');


    const [showPopupMessage, setShowPopupMessage] = useState(false);
    const rout = useRouter();

    const [selectedContact, setSelectedContact] = useState(null);


    const [viewContacts, setViewContacts] = useState(false);

    const [profilePopup, setProfilePopup] = useState(false);

    const [createChannel, setCreateChannel] = useState(false);

    const [showNotification, setShowNotification] = useState(false);

    const [viewRooms, setViewRooms] = useState(false);


    /*chats*/

    const handleSelectContact = (contact) => {
        console.log("Selected contact: ", contact);
        if (selectedContact !== contact) {
            setSelectedContact(contact);
            setTimeout(() => {
                xmpp.retrieveArchivedMessages(contact);
            }, 1000);
        }
    };

    const renderMessages = (contact) => {
        console.log('Contact-------', contact);
        console.log('Messages-------', conversationsUpdate);
        const messages = conversationsUpdate[contact];
         if (selectedContact === contact && !contact.includes('@conference') && messages) {
            return messages.map((messageObj, index) => (
                <div className='flex w-full items-center p-2' key={index}>
                  {
                    messageObj.sender.includes(xmpp.username) ? (
                      <div className='flex justify-end w-full'>
                        <ChatBubble message={messageObj.message} type='sent' timestamp={messageObj.timestamp.split('T')[0]} />
                        <div className='h-8 w-8 bg-black rounded-full flex justify-center items-center'>
                          <span className='text-white text-sm font-semibold uppercase'>{messageObj.sender[0]}</span>
                        </div>
                      </div>
                    ) : (
                      <div className='flex'>
                        <div className='h-8 w-8 bg-black rounded-full flex justify-center items-center'>
                          <span className='text-white text-sm font-semibold uppercase'>{messageObj.sender[0]}</span>
                        </div>
                        <ChatBubble message={messageObj.message} type='received' timestamp={messageObj.timestamp.split('T')[0]} />
                      </div>
                    )
                  }
                </div>
              ));
        } else if (selectedContact === contact && contact.includes('@conference')) {
            return grupalConversations[contact].map((messageObj, index) => (
                <div className='flex w-full items-center p-2' key={index}>
                    {

                        messageObj.sender === xmpp.username ? (
                            <div className='flex justify-end w-full'>
                                {
                                    messageObj.message? (
                                        <ChatBubble message={messageObj.message} type='sent' />
                                    ) : (
                                        null
                                    )
                                }
                                <div className='h-8 w-8 bg-black rounded-full flex justify-center items-center'>
                                    <span className='text-white text-sm font-semibold uppercase'>{messageObj.sender[0]}</span>
                                </div>
                            </div>
                        ) : (
                            <div className='flex'>
                            <div className='h-8 w-8 bg-black rounded-full flex justify-center items-center'>
                                <span className='text-white text-sm font-semibold uppercase'>{messageObj.sender[0]}</span>
                            </div>
                            {
                                messageObj.message ? (
                                    <ChatBubble  message={messageObj.message} type='received' />
                                ) : (
                                    null
                                )
                            }
                            </div>
                        )
                    }
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

    const handleSendPrivateMessage = ({ to, message }) => {
        console.log('Sending message to user', to, message);
        xmpp.sendMessage(to, message);
        setPrivateMessage('');
    };
    

    const handleSendGroupMessage = ({to, message}) => {
        console.log('Sending sendMessageToRoom', to, message);
        xmpp.sendMessageToRoom(to, message);
        setPrivateMessage('');
    }

    const handleShowPopupMessage = () => {
        setShowPopupMessage(!showPopupMessage)
    }

    const handleSendMessage = () => {
        if (toMessage && messagetoSend && toMessage.includes('@conference')) {
            console.log('Sending message to room');
            xmpp.sendMessageToRoom(toMessage, messagetoSend);
            setToMessage('');
            setMessageToSend('');
        }else if (toMessage && messagetoSend && !toMessage.includes('@conference')) {
            console.log('Sending message to user');
            xmpp.sendMessage(toMessage, messagetoSend);
            setToMessage('');
            setMessageToSend('');
        }
        setShowPopupMessage(false);
    }


    /*logout*/
    const handleLogout = () => {
        logout(localStorage.getItem('username'), localStorage.getItem('password'));
        localStorage.removeItem('username');
        localStorage.removeItem('password');
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
    
    /*chatrooms*/
    const onhandleChannel = () => {
        setShowChannelMessages(!showChannelMessages);
    }
    const handleCreateChannel = () => {
        setCreateChannel(!createChannel);
    }

    const handleViewRooms = () => {
        setViewRooms(!viewRooms);
    }


    /*notifications*/

    const handleNotification = () => {
        setShowNotification(!showNotification);
    }

    useEffect(() => {
        // Intentar restaurar la sesión al cargar el componente si está marcado para reconectar
        const shouldReconnect = localStorage.getItem('reconnect');
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
    
        if (shouldReconnect === 'true' && username && password) {
            login(username, password);
            localStorage.removeItem('reconnect'); // Limpiar la marca después de reconectar
        }
    }, [alreadyLogged]);
    

    

    return (
        <div className='page bg-white md:p-10 h-screen relative md:flex md:flex-col md:justify-end'>
            <input 
                type="color" 
                value={bgColor} 
                onChange={handleColorChange} 
                className="absolute bottom-0 right-0 rounded-md m-2"
            />
            <div className='absolute top-0 right-0 m-4 flex gap-4'>
                <FaPeopleRoof className='text-black text-3xl cursor-pointer' onClick={handleViewRooms} />
                <CgProfile className='text-black text-3xl cursor-pointer' onClick={handleProfilePopup} />
                <FaUserFriends className='text-black text-3xl cursor-pointer' onClick={handleViewContacts} />
                <div className='relative'>
                    <IoNotifications className='text-black text-3xl cursor-pointer' onClick={handleNotification} />
                    {
                        notification.length > 0 && (
                            <div className=' bg-red-500 rounded-full px-2 py-1 absolute -top-2 -right-2'>
                                <span className='text-white text-xs font-semibold'>{notification.length}</span>
                            </div>
                        )
                    }
                </div>
                <RiLogoutCircleRLine className='text-black text-3xl cursor-pointer' onClick={handleLogout} />
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
                            <div className='flex items-center justify-between p-2 m-2 bg-gray-200 rounded-xl cursor-pointer relative' key={invite}>
                                <div className='flex items-center'>
                                    <div className='ml-2'>{invite}</div>
                                    <button className='bg-black text-white p-2 rounded-r-xl ml-2 absolute right-0' onClick={() => xmpp.acceptInvitation(invite)}> 
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    {
                        showInvitations && grupalInvitations.map(invite => (
                            <div className='flex items-center justify-between p-2 m-2 bg-gray-500 rounded-xl cursor-pointer relative' key={invite}>
                                <div className='flex items-center'>
                                    <div className='ml-2 text-white'>{invite}</div>
                                    <button className='bg-black text-white p-2 rounded-r-xl ml-2 absolute right-0' onClick={() => xmpp.joinRoom(invite, xmpp.username)}>
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
                    {showPrivateMessages && Object.keys(conversationsUpdate).map(contact => (
                        <div className='flex items-start justify-center flex-col bg-white p-2 mb-2 rounded-xl' key={contact} onClick={() => handleSelectContact(contact)}>
                            <span className='font-bold text-sm'>{contact.split('@')[0]}</span>
                            <span className='text-xs truncate w-3/4'>
                            {conversationsUpdate[contact].length > 0 ? conversationsUpdate[contact][conversationsUpdate[contact].length - 1].message : ''}
                            </span>
                        </div>
                    ))}
                    <span className='text-md p-4 font-poppins text-white flex justify-start items-center font-semibold'>
                        Channels
                        <div className='gap-4 flex justify-center items-center'>
                            <IoIosArrowDropdownCircle 
                                className='text-white ml-2 cursor-pointer'
                                onClick={onhandleChannel}
                            />
                            <button onClick={handleCreateChannel}>
                                +
                            </button>
                        </div>
                    </span>
                    {
                        showChannelMessages && Object.keys(grupalConversations).map(channel => (
                            <div className='flex items-start justify-center flex-col bg-white p-2 mb-2 rounded-xl' key={channel} onClick={() => handleSelectContact(channel)}>
                                <span className='font-bold text-sm'>{channel}</span>
                            </div>
                        ))
                    }
                </div>
                <div className='glassmorphism shadow-2xl text-black p-10 rounded-md m-4 md:w-3/4 h-full md:h-[98%] md:m-4 md:p-0 relative'>
                    <span className='text-md p-4 font-poppins text-black flex justify-center items-center font-semibold'>
                        Chat with {selectedContact}
                    </span>
                    <div className='h-[88%] overflow-y-auto'>
                        {selectedContact && renderMessages(selectedContact)}
                    </div>
                    <div className='fixed bottom-0 w-full flex justify-end'>
                        <div className='flex w-full justify-end'>
                            <FileUploader xmpp={xmpp} to={selectedContact}/>
                            <input 
                                type='text' 
                                placeholder='Message' 
                                className='p-2 rounded-md bg-white border border-gray-300 w-full'
                                value={privateMessage}
                                onChange={onChangePrivateMessage}
                            />
                            <button className='bg-black text-white p-2 rounded-md ml-2' onClick={() =>  selectedContact.includes('@conference') ? handleSendGroupMessage({to: selectedContact, message: privateMessage}) : handleSendPrivateMessage({to: selectedContact, message: privateMessage})}>
                                <FiSend />
                            </button>
                        </div>
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
                    <div className='fixed inset-0 w-96 m-4 bg-white p-4 rounded-md shadow-lg'>
                        <span className='text-md p-4 font-poppins text-black flex justify-center items-center font-semibold'>
                            Contacts
                        </span>
                        <button  className='absolute top-0 right-0' onClick={handleViewContacts}>
                            <MdCancel  className='text-black text-2xl cursor-pointer' />
                        </button>
                        {
                            roster.map(contact => (
                                <div className='flex items-center justify-between p-2 m-2 bg-gray-200 rounded-xl cursor-pointer' key={contact} onClick={() => handleSelectContact(contact)}>
                                    <div className='flex items-center'>
                                        <div className='h-8 w-8 bg-black rounded-full'></div>
                                        <div className='ml-2 flex flex-col'>
                                            <span className='font-medium text-black'>{contact}</span>
                                            <span>
                                                 {contactStatus[contact] ? `status: (${contactStatus[contact].status})` : 'status: ()'}
                                            </span>
                                            <span>
                                                presence:{contactStatus[contact] && contactStatus[contact].show ? ` (${contactStatus[contact].show})` : 'offline'}
                                            </span>

                                        </div>
                                        <AiTwotoneDelete className='text-red-700 text-2xl cursor-pointer absolute right-10' onClick={() => xmpp.removeContact(contact)} />
                                    </div>
                                </div>
                            ))
                        }       
                        <ContactPopup xmpp={xmpp} />               
                    </div>
                )
            }
            {
                profilePopup && (
                    <ProfilePopup presence={myPresence} xmpp={xmpp} state={myStatus} />
                )
            }
            {
                showNotification && (
                    <NotificationsPopUp notifications={notification} />
                )
            }
            {
                createChannel && (
                    <ChannelCreate xmpp={xmpp} />
                )
            }
            {
                viewRooms && publicRooms && (
                    <div className='fixed inset-0 w-96 m-4 bg-white p-4 rounded-md shadow-lg overflow-y-auto'>
                        <span className='text-md p-4 font-poppins text-black flex justify-center items-center font-semibold'>
                            Rooms
                        </span>
                        <button  className='absolute top-0 right-0' onClick={handleViewRooms}>
                            <MdCancel  className='text-black text-2xl cursor-pointer' />
                        </button>
                        {
                            publicRooms.map(room => (
                                <div className='flex items-center justify-between p-2 m-2 bg-gray-200 rounded-xl cursor-pointer' key={room}>
                                    <div className='flex items-center'>
                                        <div className='h-8 w-8 bg-black rounded-full'></div>
                                        <div className='ml-2 flex flex-col'>
                                            <span className='font-medium text-black'>{room}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Chat