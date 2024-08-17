import express from 'express';
import authRoute from './routes/user_route';
import adminRoute from './routes/admin_route';
import songRoute from './routes/song_route';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBNrbT_-FImoD_7D0WNZD-YGk5LOt1HFvY',
  authDomain: 'moveotask-d9492.firebaseapp.com',
  projectId: 'moveotask-d9492',
  storageBucket: 'moveotask-d9492.appspot.com',
  messagingSenderId: '791375418610',
  appId: '1:791375418610:web:287eca231bbf2dc7d6ec6b',
  measurementId: 'G-WK7VYJ9YKP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Express app
const expressApp = express();
const PORT = process.env.PORT || 3000;

// Create the HTTP server
const server = http.createServer(expressApp);

// Initialize Socket.IO with the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    //origin: 'http://localhost:5173',
    origin: 'moveotaskfront-production-8bc4.up.railway.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

expressApp.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('startLiveInstruments', (res, name, artist) => {
    console.log('startLive from clientId:', socket.id);
    socket.broadcast.emit('startLiveInstruments', res, name, artist);
  });

  socket.on('startLiveSingers', (res, name, artist) => {
    console.log('startLive from clientId:', socket.id);
    socket.broadcast.emit('startLiveSingers', res, name, artist);
  });

  socket.on('Quit', () => {
    console.log('Quit from clientId:', socket.id);
    socket.broadcast.emit('Quit');
  });
});

// Use JSON middleware
expressApp.use(express.json());

// Define routes
expressApp.use('/auth', authRoute);
expressApp.use('/admin', adminRoute);
expressApp.use('/song', songRoute);

expressApp.get('/hello', (req, res) => {
  res.send('Server is running');
});

// Start the server
server.listen(3000, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export services
export { auth, db };
