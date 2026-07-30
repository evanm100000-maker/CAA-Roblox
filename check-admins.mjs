import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

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
const auth = getAuth(app);
const database = getDatabase(app);

async function checkAdmins() {
  try {
    console.log("Logging in...");
    const userCredential = await signInWithEmailAndPassword(auth, 'evanm.100000@gmail.com', 'Michelle11!');
    const uid = userCredential.user.uid;
    console.log("Logged in with UID:", uid);

    console.log("Setting admin record...");
    await set(ref(database, `admins/${uid}`), {
      email: 'evanm.100000@gmail.com',
      isTemp: true
    });
    console.log("Set succeeded!");

    console.log("Reading back admin record...");
    const snap = await get(ref(database, `admins/${uid}`));
    console.log("Record is:", snap.val());

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkAdmins();
