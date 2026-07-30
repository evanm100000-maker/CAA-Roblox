import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { database, auth } from '../firebase';
import { ref, onValue, set, remove, update, get } from 'firebase/database';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updatePassword as authUpdatePassword,
  getAuth,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });
  const [currentEmail, setCurrentEmail] = useState(() => {
    return sessionStorage.getItem('adminEmail') || '';
  });
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Force Firebase Auth to clear session when window is closed
    setPersistence(auth, browserSessionPersistence).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setAdmins([]);
      return;
    }
    const adminsRef = ref(database, 'admins');
    const unsubscribe = onValue(adminsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setAdmins(list);
      } else {
        setAdmins([]);
      }
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Verify admin entry in database
      const snap = await get(ref(database, `admins/${uid}`));
      const adminData = snap.val();
      if (!adminData) {
        await signOut(auth);
        return { success: false, error: 'You are not registered as an administrator.' };
      }

      if (adminData.isTemp) {
        setCurrentEmail(email);
        sessionStorage.setItem('adminEmail', email);
        return { success: true, isTemp: true, adminId: uid };
      }

      setIsAuthenticated(true);
      setCurrentEmail(email);
      sessionStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('adminEmail', email);
      return { success: true, isTemp: false };
    } catch (err) {
      console.error('Login failed:', err);
      let errorMsg = 'Invalid credentials';
      if (err.code === 'auth/invalid-email') errorMsg = 'Invalid email address';
      if (err.code === 'auth/user-disabled') errorMsg = 'This account has been disabled';
      if (err.code === 'auth/wrong-password') errorMsg = 'Wrong password';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
    setCurrentEmail('');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminEmail');
  };

  const addAdmin = async (email) => {
    const secondaryApp = getApps().find(app => app.name === 'Secondary') 
      || initializeApp(auth.app.options, 'Secondary');
    
    const secondaryAuth = getAuth(secondaryApp);
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), 'password123');
    const uid = userCredential.user.uid;
    
    await signOut(secondaryAuth);

    await set(ref(database, `admins/${uid}`), {
      email: email.trim(),
      isTemp: true
    });
  };

  const removeAdmin = async (id) => {
    await remove(ref(database, `admins/${id}`));
  };

  const updatePassword = async (adminId, newPassword) => {
    if (auth.currentUser) {
      await authUpdatePassword(auth.currentUser, newPassword);
    }
    await update(ref(database, `admins/${adminId}`), {
      isTemp: false
    });
    setIsAuthenticated(true);
    sessionStorage.setItem('isAdmin', 'true');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentEmail, admins, login, logout, addAdmin, removeAdmin, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
