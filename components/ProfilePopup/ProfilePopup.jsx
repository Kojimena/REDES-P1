import React, {useState, useEffect} from 'react'
import { CiSettings } from "react-icons/ci"
import { FaCircleUser } from "react-icons/fa6"

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
            <FaCircleUser className="text-4xl text-black m-auto" />
            <div className='flex flex-col relative w-full'>
                <h1 className="text-lg font-bold text-black m-0">{xmpp.username}</h1>
                <span className="text-xs text-gray-900">({status})</span>
                <CiSettings className="ml-auto text-xl text-black absolute right-0 top-0 cursor-pointer" onClick={handlePopup} />
            </div>
        </div>
        {
            showPopup && (
                <div className="flex flex-col gap-4 mt-4">
                    <input type="text" placeholder="Status" className="input input-bordered bg-white text-black" onChange={(e) => setStatus(e.target.value)} />
                    <button className="btn bg-black text-white p-0" onClick={() => onChangeStatus(status)}>Change presence</button>
                </div>
            )
        }
    </div>


  )
}

export default ProfilePopup