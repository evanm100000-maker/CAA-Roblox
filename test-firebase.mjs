import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyARGJBeUF0pdY4nBnjtAZJLj3T4QKAFvsE",
  authDomain: "faa-roblox.firebaseapp.com",
  databaseURL: "https://faa-roblox-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "faa-roblox",
  storageBucket: "faa-roblox.firebasestorage.app",
  messagingSenderId: "152962450215",
  appId: "1:152962450215:web:438803c9548e554e515f02",
  measurementId: "G-KM60GG0VZL"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function testConnection() {
  console.log("Testing connection...");
  try {
    const testRef = ref(database, 'test_ping');
    await set(testRef, { timestamp: Date.now() });
    console.log("Write success!");
    const snap = await get(testRef);
    console.log("Read success! Data:", snap.val());
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

// Timeout
setTimeout(() => {
  console.error("Test timed out after 5 seconds!");
  process.exit(1);
}, 5000);

testConnection();
