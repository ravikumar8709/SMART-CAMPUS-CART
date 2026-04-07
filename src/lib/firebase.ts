// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "campus-cart-vtu1x",
  appId: "1:352692982432:web:d97d616c263ec83c50efc5",
  storageBucket: "campus-cart-vtu1x.firebasestorage.app",
  apiKey: "AIzaSyCul0FKAiwOHtKhPMJ0IwCvZJuRSSaLMAQ",
  authDomain: "campus-cart-vtu1x.firebaseapp.com",
  messagingSenderId: "352692982432",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
