import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyARGJBeUF0pdY4nBnjtAZJLj3T4QKAFvsE",
  authDomain: "faa-roblox.firebaseapp.com",
  databaseURL: "https://faa-roblox-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "faa-roblox",
  storageBucket: "faa-roblox.firebasestorage.app",
  messagingSenderId: "152962450215",
  appId: "1:152962450215:web:438803c9548e554e515f02"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function logAirlines() {
  try {
    const snap = await get(ref(database, 'registeredAirlines'));
    console.log("Registered Airlines:", snap.val());
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

logAirlines();
