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
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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
    //origin: process.env.FRONTEND_URL_PROD,
    origin: process.env.FRONTEND_URL_PROD,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

expressApp.use(
  cors({
    //origin: process.env.FRONTEND_URL_PROD,
    origin: process.env.FRONTEND_URL_PROD,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('startLiveInstruments', (res, name, artist) => {
    console.log('startLiveIns from clientId:', socket.id);
    socket.broadcast.emit('startLiveInstruments', res, name, artist);
  });

  socket.on('startLiveSingers', (res, name, artist) => {
    console.log('startLiveSin from clientId:', socket.id);
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
  console.log(`Server is running !!`);
});
