"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("@firebase/firestore");
const auth_1 = require("firebase/auth");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('register');
    const { email, password, username, instrument } = req.body;
    console.log(email, password, username, instrument);
    if (!email || !password) {
        return res.status(400).send('Email or password not provided');
    }
    try {
        const auth = (0, auth_1.getAuth)(); // Initialize Firebase Auth
        const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
        const user = userCredential.user;
        console.log('User created with Firebase');
        // Initialize Firestore
        const db = (0, firestore_1.getFirestore)();
        // Add user details to Firestore with UID as document ID
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(db, 'users', user.uid), {
            uid: user.uid,
            username: username,
            instrument: instrument,
            email: email,
        });
        const response = {
            username: username,
            userID: user.uid,
        };
        return res.status(200).send(response);
    }
    catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).send('Internal server error');
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('login');
    const { email, password } = req.body;
    console.log(`${email} ${password}`);
    if (!email || !password) {
        return res.status(400).send('Email or password not provided');
    }
    try {
        console.log('try');
        const auth = (0, auth_1.getAuth)();
        // Sign in the user with Firebase Authentication
        const userCredential = yield (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
        const user = userCredential.user;
        console.log('User logged in with Firebase');
        // Retrieve additional user details from Firestore
        const db = (0, firestore_1.getFirestore)();
        const userDoc = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(db, 'users', user.uid));
        if (!userDoc.exists()) {
            return res.status(404).send('User data not found');
        }
        const userData = userDoc.data();
        const response = {
            email: (userData === null || userData === void 0 ? void 0 : userData.email) || email, // Return the provided email if not found in Firestore
            instrument: (userData === null || userData === void 0 ? void 0 : userData.instrument) || 'Not specified',
            uid: (userData === null || userData === void 0 ? void 0 : userData.uid) || user.uid,
            username: (userData === null || userData === void 0 ? void 0 : userData.username) || 'Anonymous',
        };
        return res.status(200).send(response);
    }
    catch (err) {
        console.error('Error during login:', err);
        return res.status(400).send('Invalid Credentials');
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = (0, auth_1.getAuth)();
        // Call signOut on the Firebase auth instance
        yield (0, auth_1.signOut)(auth);
        return res.status(200).send('User logged out successfully');
    }
    catch (err) {
        console.error('Error during logout:', err);
        return res.status(500).send('Internal server error');
    }
});
exports.default = {
    register,
    login,
    logout,
};
//# sourceMappingURL=user_controller.js.map