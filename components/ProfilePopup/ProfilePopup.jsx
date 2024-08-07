import React, {useState, useEffect} from 'react'
import { CiSettings } from "react-icons/ci"

const ProfilePopup = ({presence, xmpp}) => {

    const [status, setStatus] = useState(presence);
    const [showPopup, setShowPopup] = useState(false);

    const onChangeStatus = (status) => {
        xmpp.updatePresence('chat', status);
    }

    const handlePopup = () => {
        setShowPopup(!showPopup);
    }

  return (
    <div className="fixed inset-0 w-80 m-4 glassmorphism p-4 rounded-md shadow-lg">
        <div className="flex items-center w-full justify-start gap-2">
            <div className="w-12 h-12 bg-black rounded-full"></div>
            <div className='flex flex-col relative w-full'>
                <h1 className="text-lg font-bold text-black">Username</h1>
                <span className="text-xs text-gray-900">({status})</span>
                <CiSettings className="ml-auto text-xl text-black absolute right-0 top-0 cursor-pointer" onClick={handlePopup} />
            </div>
        </div>
        {
            showPopup && (
                <div className="flex flex-col gap-4 mt-4">
                    <input type="text" placeholder="Status" className="input input-bordered bg-white" onChange={(e) => setStatus(e.target.value)} />
                    <button className="btn bg-black text-white" onClick={() => onChangeStatus(status)}>Change</button>
                </div>
            )
        }
    </div>


  )
}

export default ProfilePopup