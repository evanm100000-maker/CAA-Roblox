import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const rtdb = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

async function migrate() {
  try {
    console.log("Logging into Firebase to bypass read rules...");
    await signInWithEmailAndPassword(auth, 'evanm.100000@gmail.com', 'Michelle11!');
    console.log("Logged in successfully.");

    // Define the paths we want to migrate
    const paths = ['airlines', 'requests', 'reviews', 'admins'];

    for (const path of paths) {
      console.log(`\nMigrating path: ${path}...`);
      const snap = await get(ref(rtdb, path));
      const data = snap.val();

      if (!data) {
        console.log(`No data found in RTDB for /${path}. Skipping.`);
        continue;
      }

      // Firestore collection mapping
      let collectionName = path;
      if (path === 'airlines') collectionName = 'registeredAirlines';

      const keys = Object.keys(data);
      console.log(`Found ${keys.length} records to migrate to Firestore collection '${collectionName}'.`);

      for (const key of keys) {
        const docRef = doc(firestore, collectionName, key);
        await setDoc(docRef, data[key]);
      }
      console.log(`Successfully migrated ${keys.length} records for ${path}.`);
    }

    console.log("\nMigration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
