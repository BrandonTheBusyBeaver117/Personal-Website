import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configs
const firebaseConfig = {
  apiKey: 'AIzaSyB8Qg1wo205gMOozlkWCCKDVeP2woKg5sA',
  authDomain: 'ljl-demo.firebaseapp.com',
  projectId: 'ljl-demo',
  storageBucket: 'ljl-demo.appspot.com',
  messagingSenderId: '696926417854',
  appId: '1:696926417854:web:6187dd013136d27810bfef',
};

// Server side rendering trickery
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

// Exporting the auth state
export { app, auth };
