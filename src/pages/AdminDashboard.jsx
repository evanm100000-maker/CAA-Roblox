import React from 'react';
import { useData } from '../context/DataContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { 
    airlineRequests, 
    removeAirlineRequest,
    approveAirlineRequest,
    secondaryRequests,
    removeSecondaryRequest,
    registeredAirlines,
    removeRegisteredAirline,
    reviews,
    deleteReview
  } = useData();

  return (
    <div className="container animate-fade-in dashboard-container">
      <h1 className="section-title mb-6">Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* New Airline Requests */}
        <div className="card dashboard-card">
          <h2 className="dashboard-card-title">New Airline / Review Requests</h2>
          
          {airlineRequests.length === 0 ? (
            <p className="empty-message">No pending requests.</p>
          ) : (
            <div className="request-list">
              {airlineRequests.map(request => (
                <div key={request.id} className="request-item">
                  <div className="request-header">
                    <h3 className="request-airline">{request.airlineName}</h3>
                    <span className="request-date">{new Date(request.date).toLocaleDateString()}</span>
                  </div>
                  {request.details && <p className="request-reason">{request.details}</p>}
                  <div className="request-actions">
                    <a href={request.discordLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Discord</a>
                    <button onClick={() => approveAirlineRequest(request)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>Approve & Register</button>
                    <button onClick={() => removeAirlineRequest(request.id)} className="btn btn-outline btn-sm">Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Secondary Review Requests */}
        <div className="card dashboard-card">
          <h2 className="dashboard-card-title">Secondary Review Requests</h2>
          
          {secondaryRequests.length === 0 ? (
            <p className="empty-message">No pending requests.</p>
          ) : (
            <div className="request-list">
              {secondaryRequests.map(request => (
                <div key={request.id} className="request-item">
                  <div className="request-header">
                    <h3 className="request-airline">{request.airlineName}</h3>
                    <span className="request-date">{new Date(request.date).toLocaleDateString()}</span>
                  </div>
                  <p className="request-reason">{request.reason}</p>
                  <div className="request-actions">
                    <a href={request.discordLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Discord</a>
                    <button onClick={() => removeSecondaryRequest(request.id)} className="btn btn-outline btn-sm">Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registered Airlines */}
        <div className="card dashboard-card">
          <h2 className="dashboard-card-title">Registered Airlines</h2>
          
          {registeredAirlines.length === 0 ? (
            <p className="empty-message">No registered airlines yet.</p>
          ) : (
            <div className="request-list">
              {registeredAirlines.map(airline => (
                <div key={airline.id} className="request-item">
                  <div className="request-header">
                    <h3 className="request-airline">{airline.airlineName}</h3>
                    <span className="request-date">Approved: {airline.approvedDate ? new Date(airline.approvedDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="request-actions">
                    <a href={airline.discordLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Discord</a>
                    <button onClick={() => removeRegisteredAirline(airline.id)} className="btn btn-danger btn-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Published Reviews */}
        <div className="card dashboard-card">
          <h2 className="dashboard-card-title">Manage Published Reviews</h2>
          
          {reviews.length === 0 ? (
            <p className="empty-message">No published reviews.</p>
          ) : (
            <div className="request-list">
              {reviews.map(review => (
                <div key={review.id} className="request-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="request-header" style={{ marginBottom: 0 }}>
                    <h3 className="request-airline">{review.airlineName}</h3>
                    <span className="request-date" style={{ marginLeft: '1rem' }}>Overall: {review.overall || 'N/A'}</span>
                  </div>
                  <button onClick={() => deleteReview(review.id)} className="btn btn-danger btn-sm">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
