import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    return JSON.parse(localStorage.getItem('reviews')) || [
      {
        id: 1,
        airlineName: 'FlyRoblox',
        description: 'A great airline with fantastic service and comfortable seating. Highly recommend for your next virtual flight.',
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
        safety: 5,
        realism: 4,
        aircraft: 4.5,
        overall: 'Great',
        discordLink: 'https://discord.gg/flyroblox'
      }
    ];
  });

  const [airlineRequests, setAirlineRequests] = useState(() => {
    return JSON.parse(localStorage.getItem('airlineRequests')) || [];
  });

  const [secondaryRequests, setSecondaryRequests] = useState(() => {
    return JSON.parse(localStorage.getItem('secondaryRequests')) || [];
  });

  const [registeredAirlines, setRegisteredAirlines] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredAirlines')) || [];
  });

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('airlineRequests', JSON.stringify(airlineRequests));
  }, [airlineRequests]);

  useEffect(() => {
    localStorage.setItem('secondaryRequests', JSON.stringify(secondaryRequests));
  }, [secondaryRequests]);

  useEffect(() => {
    localStorage.setItem('registeredAirlines', JSON.stringify(registeredAirlines));
  }, [registeredAirlines]);

  // Review actions
  const addReview = (review) => {
    setReviews([{ id: Date.now(), ...review }, ...reviews]);
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  // New Airline Request actions
  const addAirlineRequest = (request) => {
    setAirlineRequests([{ id: Date.now(), ...request }, ...airlineRequests]);
  };

  const removeAirlineRequest = (id) => {
    setAirlineRequests(airlineRequests.filter(req => req.id !== id));
  };

  const approveAirlineRequest = (request) => {
    setRegisteredAirlines([{ id: Date.now(), ...request, approvedDate: new Date().toISOString() }, ...registeredAirlines]);
    removeAirlineRequest(request.id);
  };

  // Secondary Request actions
  const addSecondaryRequest = (request) => {
    setSecondaryRequests([{ id: Date.now(), ...request }, ...secondaryRequests]);
  };

  const removeSecondaryRequest = (id) => {
    setSecondaryRequests(secondaryRequests.filter(req => req.id !== id));
  };

  // Registered Airlines actions
  const removeRegisteredAirline = (id) => {
    setRegisteredAirlines(registeredAirlines.filter(airline => airline.id !== id));
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
