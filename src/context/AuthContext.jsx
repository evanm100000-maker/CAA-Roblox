import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push, set, remove, update, get, query, orderByChild, equalTo } from 'firebase/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [currentEmail, setCurrentEmail] = useState(() => {
    return localStorage.getItem('adminEmail') || '';
  });
  const [admins, setAdmins] = useState([]);

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
    // 1. Check primary owner (always works even if DB is empty)
    if (email.toLowerCase() === 'evanm.100000@gmail.com' && password === 'Michelle11!') {
      setIsAuthenticated(true);
      setCurrentEmail(email);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', email);
      return { success: true, isTemp: false };
    }

    // 2. Query RTDB admins only for the matching email to secure other accounts
    try {
      const adminsRef = ref(database, 'admins');
      const q = query(adminsRef, orderByChild('email'), equalTo(email.trim()));
      const snap = await get(q);
      const data = snap.val();
      
      if (data) {
        const key = Object.keys(data)[0];
        const adminData = data[key];
        
        if (adminData.password === password) {
          if (adminData.isTemp) {
            setCurrentEmail(email);
            localStorage.setItem('adminEmail', email);
            return { success: true, isTemp: true, adminId: key };
          } else {
            setIsAuthenticated(true);
            setCurrentEmail(email);
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('adminEmail', email);
            return { success: true, isTemp: false };
          }
        }
      }
    } catch (err) {
      console.error("Login verification failed:", err);
    }
    return { success: false };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentEmail('');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
  };

  const addAdmin = async (email) => {
    const newRef = push(ref(database, 'admins'));
    await set(newRef, {
      email: email.trim(),
      password: 'password123',
      isTemp: true
    });
  };

  const removeAdmin = async (id) => {
    await remove(ref(database, `admins/${id}`));
  };

  const updatePassword = async (adminId, newPassword) => {
    await update(ref(database, `admins/${adminId}`), {
      password: newPassword,
      isTemp: false
    });
    setIsAuthenticated(true);
    localStorage.setItem('isAdmin', 'true');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentEmail, admins, login, logout, addAdmin, removeAdmin, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
