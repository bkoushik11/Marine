// File: src/App.jsx
import './App.css';
import React, { useState, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  useMap,
} from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ImageUploadButton from './components/ImageUploadButton';
import ImagePositioner from './components/ImagePositioner';
import MousePointer from './components/MousePointer';

// ✅ Fix missing marker icons (Leaflet default icons issue in Vite)
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// ✅ Base Map Layer Configuration
const baseMaps = {
  'Carto Voyager': {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

// ✅ Utility: Safely compute valid bounds
function getBoundsFromPosition(pos) {
  if (!pos) return null;
  const { Minlat, Maxlat, Minlng, Maxlng, imageUrl } = pos;

  const a = Number(Minlat);
  const b = Number(Maxlat);
  const c = Number(Minlng);
  const d = Number(Maxlng);

  // Validate all numbers
  if (![a, b, c, d].every(Number.isFinite)) return null;

  const south = Math.min(a, b);
  const north = Math.max(a, b);
  const west = Math.min(c, d);
  const east = Math.max(c, d);

  // Invalid rectangle or missing image
  if (south === north || west === east) return null;
  if (!imageUrl || typeof imageUrl !== 'string') return null;

  return [
    [south, west],
    [north, east],
  ];
}

// ✅ Auto-fit the map when bounds change
function FitBounds({ bounds, padding = [20, 20] }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;
    try {
      map.fitBounds(bounds, { padding });
    } catch (e) {
      console.warn('fitBounds failed:', e);
    }
  }, [map, bounds, padding]);

  return null;
}

function App() {
  const defaultCenter = [20.5937, 78.9629]; // India center
  const zoomLevel = 5;

  const [selectedImage, setSelectedImage] = useState(null); // File
  const [imagePosition, setImagePosition] = useState(null); // { Minlat, Maxlat, Minlng, Maxlng, imageUrl }

  // Compute bounds safely
  const bounds = useMemo(() => getBoundsFromPosition(imagePosition), [imagePosition]);

  // Cleanup blob URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (
        imagePosition &&
        imagePosition.imageUrl &&
        imagePosition.imageUrl.startsWith('blob:')
      ) {
        try {
          URL.revokeObjectURL(imagePosition.imageUrl);
        } catch (e) {
          console.warn('Failed to revoke object URL', e);
        }
      }
    };
  }, [imagePosition]);

  // Handle image upload
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setImagePosition(null);
  };

  // Handle user-submitted coordinates from ImagePositioner
  const handlePositionSet = (positionData) => {
    // Clean up old image preview to avoid blob URL leaks
    if (
      imagePosition &&
      imagePosition.imageUrl &&
      imagePosition.imageUrl.startsWith('blob:')
    ) {
      try {
        URL.revokeObjectURL(imagePosition.imageUrl);
      } catch (e) {
        console.warn(' Could not revoke previous image URL');
      }
    }
    setImagePosition(positionData);
  };

  // Reset all data and clean up preview
  const handleReset = () => {
    if (
      imagePosition &&
      imagePosition.imageUrl &&
      imagePosition.imageUrl.startsWith('blob:')
    ) {
      try {
        URL.revokeObjectURL(imagePosition.imageUrl);
      } catch (e) {}
    }
    setSelectedImage(null);
    setImagePosition(null);
  };

  return (
    <div className="map-container" style={{ height: '100%', width: '100%'}}>
      <MapContainer
        center={defaultCenter}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%'}}
      >
        <TileLayer
          url={baseMaps['Carto Voyager'].url}
          attribution={baseMaps['Carto Voyager'].attribution}
        />

        {/* ✅ Render overlay only when bounds are valid */}
        {bounds && imagePosition && (
          <>
            <ImageOverlay
              url={imagePosition.imageUrl}
              bounds={bounds}
              opacity={1}
              zIndex={500}
            />
            <FitBounds bounds={bounds} />
          </>
        )}
        <MousePointer/>
      </MapContainer>

      {/* 🧭 Control Panel (Upload / Position / Reset) */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 100,
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 8,
          zIndex: 1000,
          minWidth: 100,
          boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
        }}
      >
        {!selectedImage ? (
          <ImageUploadButton onImageSelect={handleImageSelect} />
        ) : !imagePosition ? (
          <ImagePositioner
            imageFile={selectedImage}
            onPositionSet={handlePositionSet}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '6px 0' }}>Image positioned</p>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
      
    </div>
    
  );
}

export default App;
