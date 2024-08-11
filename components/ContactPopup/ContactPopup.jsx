import React, {useState, useEffect} from 'react'
import { IoPersonAdd } from "react-icons/io5"


const ContactPopup = ({xmpp}) => {
    const [showInput, setShowInput] = useState(false);
    const [contact, setContact] = useState("");

    const handleShowInput = () => {
        setShowInput(!showInput);
    }

    const onChangeContact = (e) => {
        setContact(e.target.value);
    }

    const handleAddContact = () => {
        xmpp.sendSubscriptionRequest(contact);
        setShowInput(false);
        console.log('Contact added');
    }
  return (
    <div className='absolute bottom-0 left-0 m-4 flex justify-center gap-10 items-center'>
            <IoPersonAdd className='text-black text-2xl cursor-pointer' onClick={handleShowInput} />
            {
                showInput && (
                    <div className='flex gap-4 justify-between'>
                        <input type="text" placeholder="Contact" className='input input-bordered p-2' onChange={onChangeContact} />
                        <button className='btn bg-black text-white' onClick={handleAddContact}>Add</button>
                    </div>
                )
            }

    </div>
  )
}

export default ContactPopup