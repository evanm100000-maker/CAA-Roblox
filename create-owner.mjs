import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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

async function createOwner() {
  try {
    console.log("Creating owner account in Firebase Auth...");
    const userCredential = await createUserWithEmailAndPassword(auth, 'evanm.100000@gmail.com', 'Michelle11!');
    const uid = userCredential.user.uid;
    console.log("Successfully created user with UID:", uid);

    console.log("Adding owner to Realtime Database admins list...");
    await set(ref(database, `admins/${uid}`), {
      email: 'evanm.100000@gmail.com',
      isTemp: false
    });
    console.log("Successfully added admin record.");

    console.log("Owner account fully provisioned!");
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("Account already exists in Firebase Auth. Let's make sure they are in the DB.");
      // We can't get the UID without signing in, so let's sign in
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      try {
        const userCredential = await signInWithEmailAndPassword(auth, 'evanm.100000@gmail.com', 'Michelle11!');
        const uid = userCredential.user.uid;
        await set(ref(database, `admins/${uid}`), {
          email: 'evanm.100000@gmail.com',
          isTemp: false
        });
        console.log("Successfully added admin record for existing user.");
      } catch (signInError) {
        console.error("Failed to sign in to existing account:", signInError);
      }
      process.exit(0);
    } else {
      console.error("Error creating owner account:", error);
      process.exit(1);
    }
  }
}

createOwner();
