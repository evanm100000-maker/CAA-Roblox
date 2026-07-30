import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARGJBeUF0pdY4nBnjtAZJLj3T4QKAFvsE",
  authDomain: "faa-roblox.firebaseapp.com",
  projectId: "faa-roblox",
  storageBucket: "faa-roblox.firebasestorage.app",
  messagingSenderId: "152962450215",
  appId: "1:152962450215:web:438803c9548e554e515f02",
  measurementId: "G-KM60GG0VZL"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
