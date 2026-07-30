import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase';
import { 
  ref, 
  onValue, 
  push, 
  set,
  get,
  update,
  remove, 
  serverTimestamp 
} from 'firebase/database';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [airlineRequests, setAirlineRequests] = useState([]);
  const [secondaryRequests, setSecondaryRequests] = useState([]);
  const [registeredAirlines, setRegisteredAirlines] = useState([]);

  // Helper to convert RTDB object to sorted array
  const objectToArray = (obj) => {
    if (!obj) return [];
    return Object.keys(obj).map(key => ({
      id: key,
      ...obj[key]
    })).sort((a, b) => {
      // Sort descending by createdAt
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });
  };

  // Fetch reviews
  useEffect(() => {
    const reviewsRef = ref(database, 'reviews');
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      setReviews(objectToArray(data));
    }, (error) => {
      console.error("Error fetching reviews from RTDB:", error);
    });
    return () => unsubscribe();
  }, []);

  // Fetch airlineRequests
  useEffect(() => {
    const reqRef = ref(database, 'airlineRequests');
    const unsubscribe = onValue(reqRef, (snapshot) => {
      const data = snapshot.val();
      setAirlineRequests(objectToArray(data));
    });
    return () => unsubscribe();
  }, []);

  // Fetch secondaryRequests
  useEffect(() => {
    const secReqRef = ref(database, 'secondaryRequests');
    const unsubscribe = onValue(secReqRef, (snapshot) => {
      const data = snapshot.val();
      setSecondaryRequests(objectToArray(data));
    });
    return () => unsubscribe();
  }, []);

  // Fetch registeredAirlines
  useEffect(() => {
    const regRef = ref(database, 'registeredAirlines');
    const unsubscribe = onValue(regRef, (snapshot) => {
      const data = snapshot.val();
      setRegisteredAirlines(objectToArray(data));
    });
    return () => unsubscribe();
  }, []);

  // Review actions
  const addReview = async (review) => {
    const newRef = push(ref(database, 'reviews'));
    await set(newRef, {
      ...review,
      createdAt: serverTimestamp()
    });
  };

  const deleteReview = async (id) => {
    await remove(ref(database, `reviews/${id}`));
  };

  // New Airline Request actions
  const addAirlineRequest = async (request) => {
    const newRef = push(ref(database, 'airlineRequests'));
    await set(newRef, {
      ...request,
      createdAt: serverTimestamp()
    });
  };

  const removeAirlineRequest = async (id) => {
    await remove(ref(database, `airlineRequests/${id}`));
  };

  const approveAirlineRequest = async (request) => {
    // Add to registered
    const newRef = push(ref(database, 'registeredAirlines'));
    await set(newRef, {
      ...request,
      approvedDate: new Date().toISOString()
    });
    // Remove from requests
    if (request.id) {
       await remove(ref(database, `airlineRequests/${request.id}`));
    }
  };

  // Secondary Request actions
  const addSecondaryRequest = async (request) => {
    const newRef = push(ref(database, 'secondaryRequests'));
    await set(newRef, {
      ...request,
      createdAt: serverTimestamp()
    });
  };

  const removeSecondaryRequest = async (id) => {
    await remove(ref(database, `secondaryRequests/${id}`));
  };

  // Registered Airlines actions
  const removeRegisteredAirline = async (id) => {
    await remove(ref(database, `registeredAirlines/${id}`));
  };

  const updateRegisteredAirline = async (id, updates) => {
    try {
      const airlineRef = ref(database, `registeredAirlines/${id}`);
      await update(airlineRef, updates);
    } catch (error) {
      console.error("Error updating airline:", error);
      alert("Failed to update: " + error.message);
    }
  };

  return (
    <DataContext.Provider value={{
      reviews, addReview, deleteReview,
      airlineRequests, addAirlineRequest, removeAirlineRequest, approveAirlineRequest,
      secondaryRequests, addSecondaryRequest, removeSecondaryRequest,
      registeredAirlines, removeRegisteredAirline, updateRegisteredAirline
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
