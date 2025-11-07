import './App.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import mousePointerIcon from './assets/mouse-pointer-2.png'

// Create custom icon using PNG image
const createPointerIcon = () => {
  return L.icon({
    iconUrl: mousePointerIcon,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -15]
  })
}

const pointerIcon = createPointerIcon()

// Carto Voyager base map configuration
const baseMaps = {
  "Carto Voyager": {
    id: 'carto-voyager',
    name: 'Carto Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  }
}

function App() {
  // Default center position (India)
  const position = [20.5937, 78.9629] // Coordinates for center of India
  const zoomLevel = 5 // Zoom level to show most of India
  
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch ship data from backend API
  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await fetch('http://localhost:3000/api')
        const data = await response.json()
        setShips(data.ships)
        setLoading(false)
        setError(null)
      } catch (error) {
        console.error('Error fetching ship data:', error)
        setLoading(false)
        setError('Failed to fetch ship data. Please check if the backend server is running.')
      }
    }

    // Fetch immediately and then every 10 seconds
    fetchShips()
    const interval = setInterval(fetchShips, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="map-container">
      <MapContainer 
        center={position} 
        zoom={zoomLevel} 
        className="leaflet-container"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={baseMaps["Carto Voyager"].url}
          attribution={baseMaps["Carto Voyager"].attribution}
        />
        
        {/* Render ship markers with custom PNG icon */}
        {ships.map((ship, index) => {
          // Extract latitude and longitude from ship data
          const metaData = ship.MetaData || {}
          const payload = ship.Payload || {}
          const lat = metaData.latitude || payload.latitude || ship.latitude
          const lng = metaData.longitude || payload.longitude || ship.longitude
          
          // Only render marker if we have valid coordinates
          if (lat && lng && typeof lat === 'number' && typeof lng === 'number') {
            return (
              <Marker 
                key={index} 
                position={[lat, lng]} 
                icon={pointerIcon}
              >
                <Popup>
                  <strong>Ship Information</strong><br />
                  MMSI: {metaData.MMSI || 'N/A'}<br />
                  Latitude: {lat.toFixed(4)}<br />
                  Longitude: {lng.toFixed(4)}<br />
                  Timestamp: {metaData.time_utc || 'N/A'}
                </Popup>
              </Marker>
            )
          }
          return null
        })}
      </MapContainer>
      
      {/* Display loading or status information
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        backgroundColor: 'white', 
        padding: 10, 
        borderRadius: 5,
        zIndex: 1000,
        minWidth: 200
      }}>
        <div>Ships displayed: {ships.length}</div>
        <div>{loading ? 'Loading...' : error ? error : 'Data updated'}</div>
        {ships.length === 0 && !loading && !error && (
          <div style={{ marginTop: 10, fontSize: '0.9em', color: '#666' }}>
            No ship data available. This could be due to:
            <ul style={{ paddingLeft: 20, margin: '5px 0 0 0' }}>
              <li>API connection limits</li>
              <li>No ships in the current region</li>
              <li>Backend server issues</li>
            </ul>
          </div>
        )}
      </div> */}
    </div>
  )
}

export default App