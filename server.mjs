import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';


const app = express();
const port = process.env.PORT || 6001;

app.use(cors());
app.use(bodyParser.json());

// Start the HTTP server
const server = app.listen(port, () => {
  console.log(`HTTP Server listening at http://localhost:${port}`);
});

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received: ', message);
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });
});

app.post('/orders', (req, res) => {
  // Broadcast the order to all WebSocket clients
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(req.body));
  });

  res.status(200).json(req.body);
});
