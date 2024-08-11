import React, { useState } from 'react'

const FileUploader = ({ to, xmpp }) => {

    const [file, setFile] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    }

  return (
    <div>
      <input type="file" className="file-input w-full max-w-xs" onChange={onFileChange} />
    </div>
  );
}

export default FileUploader