import React, {useState} from 'react';

const ChannelCreate = ({ xmpp }) => {

    const [channel, setChannel] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [invitedUser, setInvitedUser] = useState('');
    const [stateChannel, setstateChannel] = useState('create');
    const [message, setMessage] = useState('');

    const handleCreateChannel = () => {
        console.log('domain:', xmpp.domain);
        xmpp.joinRoomAndBookmarkAsModerator(channel+"@conference."+xmpp.domain, xmpp.username);
        setShowPopup(true);

    }

    const handleJoinChannel = () => {
        xmpp.joinRoom(channel+"@conference."+ xmpp.domain, xmpp.username);
    }

    const handleInvitedUser = (event) => {
        setInvitedUser(event.target.value);
    }


    const onChangeChannel = (event) => {
        setChannel(event.target.value);
    }

    const handleInvite = () => {
        xmpp.inviteToRoom(channel+"@conference."+ xmpp.domain, invitedUser);
    }

    const onChangeMessage = (event) => {
        setMessage(event.target.value);
    }

    const handleSendMessagetoChannel = () => {
        xmpp.sendMessageToRoom(channel+"@conference."+ xmpp.domain, message);
    }


  return (
    <div className="absolute bottom-0 right-0 flex flex-col justify-start p-10 gap-10 items-center h-screen bg-black w-96"> 
        <div className='flex gap-4 justify-between'>
            <button className={`bg-transparent text-white ${stateChannel === 'create' ? 'border-b-2 border-white p-2' : ''}`} onClick={() => setstateChannel('create')}>Create</button>
            <button className={`bg-transparent text-white ${stateChannel === 'send' ? 'border-b-2 border-white p-2' : ''}`} onClick={() => setstateChannel('send')}>Send Message</button>
            <button className={`bg-transparent text-white ${stateChannel === 'join' ? 'border-b-2 border-white p-2' : ''}`} onClick={() => setstateChannel('join')}>Join Channel</button>
        </div>
        {
            stateChannel === 'create' && (
                <div className="flex gap-4 justify-between flex-col">
                    <span className="text-white text-2xl cursor-pointer font-semibold">Create Channel</span>
                    <input type="text" placeholder="Channel" className="input input-bordered p-2" onChange={onChangeChannel} />
                    <button className="btn bg-black text-white" onClick={handleCreateChannel}>Create</button>
                </div>
            )
        }
        {
            stateChannel === 'send' && (
                <div className="flex gap-4 justify-between flex-col">
                    <span className="text-white text-xl cursor-pointer font-semibold">Send Message to Channel</span>
                    <input type="text" placeholder="Channel" className="input input-bordered p-2" onChange={onChangeChannel} />
                    <input type="text" placeholder="Message" className="input input-bordered p-2" onChange={onChangeMessage} value={message} />
                    <button className="btn bg-black text-white" onClick={handleSendMessagetoChannel}>Send</button>
                </div>
            )
        }
        {
            stateChannel === 'create' && (
                <div className="glassmorphism p-4 rounded-md shadow-lg flex flex-col justify-center items-center gap-4">
                    <h2 className="text-white text-xl font-semibold">Channel {channel} created!</h2>
                    <span className="text-gray-300">You can now invite your friends to join the channel</span>
                    <div className="flex gap-4 justify-between">
                        <input type="text" placeholder="Invite user" className="input input-bordered p-2" onChange={handleInvitedUser} />
                        <button className="btn bg-black text-white" onClick={handleInvite}>Invite</button>
                    </div>
                </div>
            )
        }
        {
            stateChannel === 'join' && (
                <div className="flex gap-4 justify-between flex-col">
                    <span className="text-white text-xl cursor-pointer font-semibold">Join Channel</span>
                    <input type="text" placeholder="Channel" className="input input-bordered p-2" onChange={onChangeChannel} />
                    <button className="btn bg-black text-white" onClick={handleJoinChannel}>Join</button>
                </div>
            )
        }
    </div>
  )
}

export default ChannelCreate;
