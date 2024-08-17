import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore';
import { Request, Response } from 'express';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const register = async (req: Request, res: Response) => {
  console.log('register');
  const { email, password, username, instrument } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email or password not provided');
  }

  try {
    const auth = getAuth(); // Initialize Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log('User created with Firebase');

    // Initialize Firestore
    const db = getFirestore();

    // Add user details to Firestore with UID as document ID
    await setDoc(doc(db, 'users', user.uid), {
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
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).send('Internal server error');
  }
};

const login = async (req: Request, res: Response) => {
  console.log('login');
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email or password not provided');
  }

  try {
    console.log('try');
    const auth = getAuth();

    // Sign in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log('User logged in with Firebase');

    // Retrieve additional user details from Firestore
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      return res.status(404).send('User data not found');
    }

    const userData = userDoc.data();

    const response = {
      email: userData?.email || email, // Return the provided email if not found in Firestore
      instrument: userData?.instrument || 'Not specified',
      uid: userData?.uid || user.uid,
      username: userData?.username || 'Anonymous',
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(400).send('Invalid Credentials');
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const auth = getAuth();

    // Call signOut on the Firebase auth instance
    await signOut(auth);

    return res.status(200).send('User logged out successfully');
  } catch (err) {
    console.error('Error during logout:', err);
    return res.status(500).send('Internal server error');
  }
};

export default {
  register,
  login,
  logout,
};
