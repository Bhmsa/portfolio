/* ============================================
   Firebase Configuration
   Royal Fashion Hub
   
   INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Create a new project (or use existing)
   3. Add a Web App
   4. Copy your Firebase config object
   5. Replace the values below with your own
   6. Enable Authentication > Email/Password
   7. Create a Firestore database
   ============================================ */

// Import Firebase modules from CDN (v10+ Modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// ==============================
// ⚠️ REPLACE WITH YOUR FIREBASE CONFIG
// ==============================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export everything needed by other modules
export {
  db,
  auth,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
