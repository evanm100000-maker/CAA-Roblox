import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [airlineRequests, setAirlineRequests] = useState([]);
  const [secondaryRequests, setSecondaryRequests] = useState([]);
  const [registeredAirlines, setRegisteredAirlines] = useState([]);

  // Fetch reviews
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      // Fallback if index isn't built or permissions fail
      if (error.code === 'failed-precondition') {
        const simpleQ = collection(db, 'reviews');
        onSnapshot(simpleQ, (snap) => setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
    });
    return unsubscribe;
  }, []);

  // Fetch airlineRequests
  useEffect(() => {
    const q = query(collection(db, 'airlineRequests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAirlineRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      if (error.code === 'failed-precondition') {
        onSnapshot(collection(db, 'airlineRequests'), (snap) => setAirlineRequests(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
    });
    return unsubscribe;
  }, []);

  // Fetch secondaryRequests
  useEffect(() => {
    const q = query(collection(db, 'secondaryRequests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSecondaryRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
       if (error.code === 'failed-precondition') {
         onSnapshot(collection(db, 'secondaryRequests'), (snap) => setSecondaryRequests(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
       }
    });
    return unsubscribe;
  }, []);

  // Fetch registeredAirlines
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'registeredAirlines'), (snapshot) => {
      setRegisteredAirlines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // Review actions
  const addReview = async (review) => {
    await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp()
    });
  };

  const deleteReview = async (id) => {
    await deleteDoc(doc(db, 'reviews', id));
  };

  // New Airline Request actions
  const addAirlineRequest = async (request) => {
    try {
      await addDoc(collection(db, 'airlineRequests'), {
        ...request,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error adding request: ", e);
    }
  };

  const removeAirlineRequest = async (id) => {
    try {
      await deleteDoc(doc(db, 'airlineRequests', id));
    } catch (e) {
      console.error("Error removing request: ", e);
    }
  };

  const approveAirlineRequest = async (request) => {
    try {
      // Add to registered
      await addDoc(collection(db, 'registeredAirlines'), {
        ...request,
        approvedDate: new Date().toISOString()
      });
      // Remove from requests
      if (request.id) {
         await deleteDoc(doc(db, 'airlineRequests', request.id));
      }
    } catch (e) {
      console.error("Error approving request: ", e);
    }
  };

  // Secondary Request actions
  const addSecondaryRequest = async (request) => {
    try {
      await addDoc(collection(db, 'secondaryRequests'), {
        ...request,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error adding secondary request: ", e);
    }
  };

  const removeSecondaryRequest = async (id) => {
    try {
      await deleteDoc(doc(db, 'secondaryRequests', id));
    } catch (e) {
      console.error("Error removing secondary request: ", e);
    }
  };

  // Registered Airlines actions
  const removeRegisteredAirline = async (id) => {
    try {
      await deleteDoc(doc(db, 'registeredAirlines', id));
    } catch (e) {
      console.error("Error removing registered airline: ", e);
    }
  };

  return (
    <DataContext.Provider value={{
      reviews, addReview, deleteReview,
      airlineRequests, addAirlineRequest, removeAirlineRequest, approveAirlineRequest,
      secondaryRequests, addSecondaryRequest, removeSecondaryRequest,
      registeredAirlines, removeRegisteredAirline
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
