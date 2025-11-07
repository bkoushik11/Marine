import React, { useState } from 'react';

const ImagePositioner = ({ imageFile, onPositionSet }) => {
  const [Minlat, setMinLat] = useState('');
  const [Maxlat, setMaxLat] = useState('');
  const [Minlng, setMinLng] = useState('');
  const [Maxlng, setMaxLng] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const minlatNum = parseFloat(Minlat);
    const maxlatNum = parseFloat(Maxlat);
    const minlngNum = parseFloat(Minlng);
    const maxlngNum = parseFloat(Maxlng);

    if (isNaN(minlatNum) || isNaN(maxlatNum) || isNaN(minlngNum) || isNaN(maxlngNum)) {
      alert('Please enter valid numeric values.');
      return;
    }

    onPositionSet({
      Minlat: minlatNum,
      Maxlat: maxlatNum,
      Minlng: minlngNum,
      Maxlng: maxlngNum,
      imageUrl: URL.createObjectURL(imageFile),
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        width: '180px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        fontFamily: 'sans-serif',
      }}
    >
      <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', textAlign: 'center' }}>
        Image Position
      </h4>

      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <img
          src={URL.createObjectURL(imageFile)}
          alt="Preview"
          style={{
            width: '60px',
            height: '60px',
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #eee',
          }}
        />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '6px' }}>
        {[
          { label: 'MinLat', value: Minlat, setter: setMinLat },
          { label: 'MaxLat', value: Maxlat, setter: setMaxLat },
          { label: 'Minlng', value: Minlng, setter: setMinLng },
          { label: 'Maxlng', value: Maxlng, setter: setMaxLng },
        ].map(({ label, value, setter }) => (
          <input
            key={label}
            type="number"
            step="any"
            placeholder={label}
            value={value}
            onChange={(e) => setter(e.target.value)}
            style={{
              padding: '4px',
              fontSize: '12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              textAlign: 'center',
            }}
          />
        ))}

        <button
          type="submit"
          style={{
            padding: '6px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          Set Position
        </button>
      </form>
    </div>
  );
};

export default ImagePositioner;