import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARGJBeUF0pdY4nBnjtAZJLj3T4QKAFvsE",
  authDomain: "faa-roblox.firebaseapp.com",
  databaseURL: "https://faa-roblox-default-rtdb.firebaseio.com",
  projectId: "faa-roblox",
  storageBucket: "faa-roblox.firebasestorage.app",
  messagingSenderId: "152962450215",
  appId: "1:152962450215:web:438803c9548e554e515f02",
  measurementId: "G-KM60GG0VZL"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
