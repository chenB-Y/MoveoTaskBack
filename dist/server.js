"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = void 0;
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const admin_route_1 = __importDefault(require("./routes/admin_route"));
const song_route_1 = __importDefault(require("./routes/song_route"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
// Initialize Firestore and Auth
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
// Initialize Express app
const expressApp = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Create the HTTP server
const server = http_1.default.createServer(expressApp);
// Initialize Socket.IO with the HTTP server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});
expressApp.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
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
expressApp.use(express_1.default.json());
// Define routes
expressApp.use('/auth', user_route_1.default);
expressApp.use('/admin', admin_route_1.default);
expressApp.use('/song', song_route_1.default);
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map