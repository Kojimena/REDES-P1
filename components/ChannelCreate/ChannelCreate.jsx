import React, {useState} from 'react';

const ChannelCreate = ({ xmpp }) => {

    const [channel, setChannel] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [invitedUser, setInvitedUser] = useState('');

    const handleCreateChannel = () => {
        console.log('domain:', xmpp.domain);
        xmpp.joinRoomAndBookmark(channel+"@conference."+ xmpp.domain, xmpp.username);
        setShowPopup(true);

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

  return (
    <div className="absolute bottom-0 right-0 flex flex-col justify-start p-10 gap-10 items-center h-screen bg-black"> 
        <label className="text-white text-2xl cursor-pointer font-semibold">Create Channel</label>
        <div className="flex gap-4 justify-between">
            <input type="text" placeholder="Channel" className="input input-bordered p-2" onChange={onChangeChannel} />
            <button className="btn bg-black text-white" onClick={handleCreateChannel}>Create</button>
        </div>
        {
            showPopup && (
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
    </div>
  )
}

export default ChannelCreate;
