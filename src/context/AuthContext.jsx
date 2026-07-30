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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState('');
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Force Firebase Auth to clear session when window is closed
    setPersistence(auth, browserSessionPersistence).catch(console.error);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setCurrentEmail('');
        setIsAuthLoading(false);
        return;
      }

      // Check if they are an admin
      const snap = await get(ref(database, `admins/${user.uid}`));
      const data = snap.val();
      if (!data) {
        await signOut(auth);
        setIsAuthenticated(false);
        setCurrentEmail('');
        setIsAuthLoading(false);
        return;
      }

      // Fetch their current IP for validation
      let userIp = 'Unknown';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        userIp = ipData.ip;
      } catch (e) {
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          const ipData = await ipRes.json();
          userIp = ipData.ip;
        } catch (e2) {}
      }

      const recognizedIps = data.recognizedIps || [];

      // If they are missing setup or unrecognized IP, don't consider them fully authenticated
      // (The login flow handles routing them to the correct challenge page)
      if (data.isTemp || !data.securityQuestion || (!recognizedIps.includes(userIp) && userIp !== 'Unknown')) {
        setIsAuthenticated(false);
        setCurrentEmail(data.email);
        setIsAuthLoading(false);
        return;
      }

      // All good, fully authenticated session restored
      setIsAuthenticated(true);
      setCurrentEmail(data.email);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

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
        
        // Auto-kick if current admin was removed
        if (currentEmail) {
          const stillAdmin = list.some(a => a.email.toLowerCase() === currentEmail.toLowerCase());
          if (!stillAdmin) {
            console.log("Admin account removed. Forcing logout.");
            logout();
          }
        }
      } else {
        setAdmins([]);
        if (currentEmail) logout();
      }
    });
    return () => unsubscribe();
  }, [isAuthenticated, currentEmail]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const snap = await get(ref(database, `admins/${uid}`));
      const adminData = snap.val();
      if (!adminData) {
        await signOut(auth);
        return { success: false, error: 'You are not registered as an administrator.' };
      }

      let userIp = 'Unknown';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        userIp = ipData.ip;
      } catch (e) {
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          const ipData = await ipRes.json();
          userIp = ipData.ip;
        } catch (e2) {}
      }

      try {
        await update(ref(database, `admins/${uid}`), {
          lastLoginIp: userIp,
          lastLoginDate: new Date().toISOString()
        });
      } catch(e) {}

      if (adminData.isTemp) {
        return { success: true, isTemp: true, adminId: uid };
      }

      const hasSecurityQuestion = !!adminData.securityQuestion;
      if (!hasSecurityQuestion) {
        return { success: true, requiresSetup: true, adminId: uid };
      }

      const recognizedIps = adminData.recognizedIps || [];
      if (!recognizedIps.includes(userIp) && userIp !== 'Unknown') {
        return { success: true, requiresChallenge: true, adminId: uid, ip: userIp };
      }

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

  const updatePassword = async (adminId, newPassword, securityQuestion, securityAnswer, ip) => {
    if (auth.currentUser) {
      await authUpdatePassword(auth.currentUser, newPassword);
    }
    const snap = await get(ref(database, `admins/${adminId}`));
    const data = snap.val() || {};
    const recognizedIps = data.recognizedIps || [];
    if (ip && ip !== 'Unknown' && !recognizedIps.includes(ip)) recognizedIps.push(ip);

    await update(ref(database, `admins/${adminId}`), {
      isTemp: false,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      recognizedIps
    });
    setIsAuthenticated(true);
  };

  const setupSecurityQuestion = async (adminId, securityQuestion, securityAnswer, ip) => {
    const snap = await get(ref(database, `admins/${adminId}`));
    const data = snap.val() || {};
    const recognizedIps = data.recognizedIps || [];
    if (ip && ip !== 'Unknown' && !recognizedIps.includes(ip)) recognizedIps.push(ip);

    await update(ref(database, `admins/${adminId}`), {
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      recognizedIps
    });
    setIsAuthenticated(true);
  };

  const verifySecurityChallenge = async (adminId, answer, ip) => {
    const snap = await get(ref(database, `admins/${adminId}`));
    const data = snap.val();
    if (!data || !data.securityAnswer) return false;

    if (data.securityAnswer === answer.toLowerCase().trim()) {
      const recognizedIps = data.recognizedIps || [];
      if (ip && ip !== 'Unknown' && !recognizedIps.includes(ip)) recognizedIps.push(ip);
      await update(ref(database, `admins/${adminId}`), {
        recognizedIps
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const getSecurityQuestion = async (adminId) => {
    const snap = await get(ref(database, `admins/${adminId}`));
    const data = snap.val();
    return data?.securityQuestion || '';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, isAuthLoading, currentEmail, admins, login, logout, addAdmin, removeAdmin, 
      updatePassword, setupSecurityQuestion, verifySecurityChallenge, getSecurityQuestion 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
