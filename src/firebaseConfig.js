// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpRdNjtxVGiC6NCjt58-gnJUdvnbODXpc",
  authDomain: "carjourney491b.firebaseapp.com",
  projectId: "carjourney491b",
  storageBucket: "carjourney491b.appspot.com",
  messagingSenderId: "248223244957",
  appId: "1:248223244957:web:4b1d289950719d829d6a74",
  measurementId: "G-WF2R4YV2CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize Storage

// Export auth, db, analytics, and serverTimestamp
export { app, auth, db, analytics, storage, onAuthStateChanged, signOut, serverTimestamp };
