import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Asegúrate de que la importación de useRouter sea correcta
import { MdCancel } from 'react-icons/md';
import { on } from '@/services/xmppService';

const DelPopUp = ({ xmpp, onClose }) => {
    const router = useRouter();
    useEffect(() => {
        const handleDeleteAccount = () => {
            router.push('/'); 
        };

        xmpp.on('accountDeleted', handleDeleteAccount);

        return () => {
            xmpp.off('accountDeleted', handleDeleteAccount);
        };
    }, [xmpp, router]);  

    const handleDeleteAccountRequest = () => {
        xmpp.deleteAccount();  
    };

    return (
        <div className='fixed w-96 m-4 bg-white p-4 rounded-md shadow-lg top-1/3'>
            <span className='text-md p-4 font-poppins text-black flex justify-center items-center font-semibold'>
                Delete Account from Server
            </span>
            <button className='absolute top-0 right-0' onClick={() => onClose()}>
                <MdCancel className='text-black text-2xl cursor-pointer' />
            </button>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <span className='text-md text-black'>Are you sure you want to delete your account?</span>
                <span className='text-xs text-black'>This action is irreversible.</span>
                <div className='flex gap-4 justify-center'>
                    <button className='bg-blue-500 text-white p-2 rounded-md' onClick={() => onClose()}>
                        Cancel
                    </button>
                    <button className='bg-red-500 text-white p-2 rounded-md' onClick={handleDeleteAccountRequest}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DelPopUp;
