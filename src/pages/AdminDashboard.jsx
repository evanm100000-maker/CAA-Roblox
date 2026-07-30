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
    markAirlineAsReviewed,
    reviews,
    deleteReview
  } = useData();

  const newAirlineRequests = airlineRequests.filter(req => req.requestType === 'registration');
  const initialReviewRequests = airlineRequests.filter(req => req.requestType !== 'registration');

  return (
    <div className="container animate-fade-in dashboard-container">
      <h1 className="section-title mb-6">Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* New Airline Requests */}
        <div className="card dashboard-card">
          <h2 className="dashboard-card-title">New Airline Registrations</h2>
          
          {newAirlineRequests.length === 0 ? (
            <p className="empty-message">No pending registrations.</p>
          ) : (
            <div className="request-list">
              {newAirlineRequests.map(request => (
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

        {/* Initial Review Requests */}
        <div className="card dashboard-card">
          <h2 className="dashboard-card-title">Initial Review Requests</h2>
          
          {initialReviewRequests.length === 0 ? (
            <p className="empty-message">No pending review requests.</p>
          ) : (
            <div className="request-list">
              {initialReviewRequests.map(request => (
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
                <div key={airline.id} className="request-item" style={{ borderLeft: airline.isReviewed ? '4px solid #10b981' : 'none' }}>
                  <div className="request-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 className="request-airline">{airline.airlineName}</h3>
                      {airline.isReviewed && <span style={{ backgroundColor: '#10b981', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>Reviewed</span>}
                    </div>
                    <span className="request-date">Approved: {airline.approvedDate ? new Date(airline.approvedDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="request-actions">
                    <a href={airline.discordLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Discord</a>
                    {!airline.isReviewed && (
                      <button onClick={() => markAirlineAsReviewed(airline.id)} className="btn btn-outline btn-sm" style={{ borderColor: '#10b981', color: '#10b981' }}>Mark as Reviewed</button>
                    )}
                    <button onClick={() => removeRegisteredAirline(airline.id)} className="btn btn-danger btn-sm">Delete</button>
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
