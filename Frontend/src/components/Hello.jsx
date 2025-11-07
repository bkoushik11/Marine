  // Fetch ship data from backend API
  // useEffect(() => {
  //   const fetchShips = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/api')
  //       const data = await response.json()
  //       setShips(data.ships)
  //       setLoading(false)
  //       setError(null)
  //     } catch (error) {
  //       console.error('Error fetching ship data:', error)
  //       setLoading(false)
  //       setError('Failed to fetch ship data. Please check if the backend server is running.')
  //     }
  //   }

    // Fetch immediately and then every 10 seconds
  //   fetchShips()
  //   const interval = setInterval(fetchShips, 10000)
    
  //   return () => clearInterval(interval)
  // }, [])


          {/* Render ship markers
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
           */}

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