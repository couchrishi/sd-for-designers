import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [uploadStatusMessage, setUploadStatusMessage] = useState('');

  const fileInputRef = useRef(null); // Reference to the file input element.

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    try {
      if (selectedFiles.length === 0) {
        alert('Please select at least one file to upload.');
        return;
      }

      setUploading(true);

      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
      }

      console.log('UPLOAD_HANDLER_URL:', process.env.UPLOAD_HANDLER_URL);
      
      const response = await fetch('YOUR_CLOUD_RUN_BACKEND_URL/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setJobId(data.jobId);
      setUploadStatusMessage(`Uploaded ${selectedFiles.length} images successfully.`);

      setSelectedFiles([]);
      setUploading(false);

      // Reset the file input element after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatusMessage('Something went wrong while uploading files.');
      setUploading(false);
    }
  };

  const handleUploadButtonClick = () => {
    if (selectedFiles.length === 0) {
      // If no files are selected, open the file explorer
      document.getElementById('file-input').click();
    } else {
      // If files are already selected, proceed with the upload
      handleUpload();
    }
  };

  const buttonText = uploading ? 'Uploading...' : selectedFiles.length > 0 ? 'Upload' : 'Choose Files';

  return (
    <div className="App">
      <h1>Fine tune Stable Diffusion with your own Images</h1>
      <div className="file-input-wrapper">
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <button className="upload-btn" onClick={handleUploadButtonClick} disabled={uploading}>
          {buttonText}
        </button>
      </div>
      {!uploading && selectedFiles.length > 0 && (
        <div className="file-count">
          <p>{selectedFiles.length} files selected</p>
        </div>
      )}
      {uploadStatusMessage && <div className="upload-status">{uploadStatusMessage}</div>}
      {jobId && <p>Job ID: {jobId}</p>}
    </div>
  );
}

export default App;
