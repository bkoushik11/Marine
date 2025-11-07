const express = require('express');
const WebSocket = require('ws');
const cors = require('cors'); // Add CORS support
require('dotenv').config();

const app = express();
const port = 3000;

// Add CORS middleware
app.use(cors());

// Your AISStream API key from .env file
const AIS_API_KEY = process.env.AIS_API_KEY || 'f27b10aac8a59fb33865f019305f68ebb54764df';

// Define a broader bounding box to capture more ship data
const BROAD_BBOX = [
  [-90, -180],   // SW corner: [lat, lon] - Global coverage
  [90, 180]      // NE corner: [lat, lon] - Global coverage
];

let shipData = []; // stores last 1000 messages
let connectionAttempts = 0;
let maxConnectionAttempts = 5;

// Root route
app.get('/', (req, res) => {
  res.send('AISStream API Server Running');
});

// /api route to get JSON of latest ships
app.get('/api', (req, res) => {
  // Filter for PositionReport messages which contain location data
  const positionReports = shipData.filter(msg => {
    // Check if this is a PositionReport with valid coordinates
    if (msg.MessageType !== 'PositionReport') return false;
    
    // Check various possible locations for coordinates
    const metaData = msg.MetaData || {};
    const payload = msg.Payload || {};
    
    // Valid coordinates should be numbers within reasonable ranges
    const lat = metaData.latitude || payload.latitude || msg.latitude;
    const lng = metaData.longitude || payload.longitude || msg.longitude;
    
    return (typeof lat === 'number' && lat >= -90 && lat <= 90) && 
           (typeof lng === 'number' && lng >= -180 && lng <= 180);
  });
  
  res.json({
    count: positionReports.length,
    ships: positionReports.slice(-100), // last 100 ship positions
    timestamp: new Date().toISOString(),
    connectionAttempts: connectionAttempts
  });
});

// WebSocket connection to AISStream
function connectToAISStream() {
  // Limit connection attempts to prevent infinite retries
  if (connectionAttempts >= maxConnectionAttempts) {
    console.log('Maximum connection attempts reached. Please check your API key or wait before retrying.');
    return;
  }
  
  connectionAttempts++;
  console.log(`Connection attempt ${connectionAttempts}/${maxConnectionAttempts}`);
  
  const ws = new WebSocket('wss://stream.aisstream.io/v0/stream');

  ws.onopen = () => {
    console.log('Connected to AISStream.io');
    connectionAttempts = 0; // Reset on successful connection
    
    // Send subscription message for global region and PositionReport
    const subscriptionMessage = {
      APIkey: AIS_API_KEY,
      BoundingBoxes: [BROAD_BBOX],
      FilterMessageTypes: ['PositionReport']
    };

    ws.send(JSON.stringify(subscriptionMessage));
    console.log('Subscription message sent');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Check if this is an error message
      if (data.error) {
        console.error('AISStream API Error:', data.error);
        ws.close(); // Close connection on error
        return;
      }
      
      // Store all messages for now, filter on API request
      shipData.push(data);
      if (shipData.length > 1000) shipData = shipData.slice(-1000);
      
      // Log receipt of PositionReport messages only
      if (data.MessageType === 'PositionReport') {
        console.log(`Received ship data: MMSI ${data.MetaData?.MMSI || 'Unknown'}`);
      }
      
    } catch (err) {
      console.error('Error parsing AIS message:', err);
    }
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
  
  ws.onclose = () => {
    console.log('AISStream connection closed. Reconnecting in 5 seconds...');
    setTimeout(connectToAISStream, 5000);
  };
}

// Start AISStream connection
connectToAISStream();

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});