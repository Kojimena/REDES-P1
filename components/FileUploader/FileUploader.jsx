import React, { useState } from 'react';

const FileUploader = ({ xmpp, to }) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const onFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        setFile(selectedFile);
        setUploadStatus('Sending file...'); 
        await handleUpload(selectedFile); 
    };

    const onSendFile = (url) => {
        xmpp.sendMessage(to, url);
    };

    const handleUpload = async (selectedFile) => {
        console.log('Uploading file...');
        const formData = new FormData();
        formData.append('files', selectedFile);
        try {
            const response = await fetch('https://redes-markalbrand56.koyeb.app/files/jim', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json(); 
                console.log('File uploaded successfully', result);
                const fileUrl = result.paths[0]; 
                onSendFile(fileUrl);
                setUploadStatus('File uploaded successfully');
                setTimeout(() => {
                    setUploadStatus('');
                } , 2000); 
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" className="file-input" onChange={onFileChange} />
            {uploadStatus && <p className='absolute bottom-12 left-10 text-white'>{uploadStatus}</p>}
        </div>
    );
};

export default FileUploader;