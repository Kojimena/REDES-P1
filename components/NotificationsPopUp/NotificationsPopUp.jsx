import React from 'react'
import { FaBell } from "react-icons/fa"

const NotificationsPopUp = ({notifications}) => {

  return (
    <div className="fixed inset-0 w-80 m-4 glassmorphism p-4 rounded-md shadow-lg">
        <div className="flex items-center w-full justify-start gap-2">
            <FaBell className="text-4xl text-black m-auto" />
            <div className='flex flex-col relative w-full'>
                <h1 className="text-lg font-bold text-black m-0">Notifications</h1>
            </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {   
            (notifications).map((notification, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <span className="text-xs text-gray-900">{notification.split('/')[0]}</span>
                </div>
            ))
            }
        </div>
    </div>
  )
}

export default NotificationsPopUp