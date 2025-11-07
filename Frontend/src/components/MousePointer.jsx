// File: src/components/MousePointer.jsx
import React, { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

const MousePointer = () => {
  const [position, setPosition] = useState({ lat: null, lng: null });

  // ✅ Track mouse movement over the map
  useMapEvents({
    mousemove(e) {
      setPosition({
        lat: e.latlng.lat.toFixed(5),
        lng: e.latlng.lng.toFixed(5),
      });
    },
    mouseout() {
      // Optional: clear when mouse leaves the map
      setPosition({ lat: null, lng: null });
    },
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '13px',
        fontFamily: 'monospace',
        zIndex: 1000,
        minWidth: '140px',
        textAlign: 'center',
      }}
    >
      
        <>
          <div>Lat: {position.lat}</div>
          <div>Lng: {position.lng}</div>
        </>
    
    </div>
  );
};

export default MousePointer;
