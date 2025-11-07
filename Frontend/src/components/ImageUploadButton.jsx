import React, { useRef } from 'react';

const ImageUploadButton = ({ onImageSelect }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        onClick={handleButtonClick}
        style={{
          padding: '10px 15px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Select Image
      </button>
    </div>
  );
};

export default ImageUploadButton;
