import React from 'react'
import { FaBell } from "react-icons/fa"
import { useXmpp } from '@/contexts/xmppContext'
import { IoReloadCircle } from "react-icons/io5";


const NotificationsPopUp = ({notifications}) => {

    const { xmpp, clearNotification } = useXmpp();

  return (
    <div className="fixed inset-0 w-80 m-4 bg-black p-4 rounded-md shadow-lg overflow-y-auto">
        <div className="flex items-center w-full justify-start gap-2">
            <FaBell className="text-4xl text-white m-auto" />
            <div className='flex flex-col relative w-full'>
                <h1 className="text-lg font-bold text-white m-0">Notifications</h1>
            </div>
            <IoReloadCircle className="text-3xl text-white cursor-pointer" onClick={clearNotification} />
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {   
            (notifications).map((notification, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <span className="text-xs text-white">
                        {notification}
                    </span>
                </div>
            ))
            }
        </div>
    </div>
  )
}

export default NotificationsPopUp