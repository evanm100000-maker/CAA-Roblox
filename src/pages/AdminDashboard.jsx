import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
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

  const { admins, addAdmin, removeAdmin } = useAuth();
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    try {
      await addAdmin(newAdminEmail);
      setNewAdminEmail('');
      alert('Admin added successfully with temporary password "password123"!');
    } catch (err) {
      console.error(err);
      alert('Failed to add admin.');
    }
  };

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
                    <span className="request-date">
                      {new Date(request.date).toLocaleDateString()}
                      {request.ipAddress && <span style={{ marginLeft: '1rem', color: '#ef4444' }}>IP: {request.ipAddress}</span>}
                    </span>
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
                    <span className="request-date">
                      {new Date(request.date).toLocaleDateString()}
                      {request.ipAddress && <span style={{ marginLeft: '1rem', color: '#ef4444' }}>IP: {request.ipAddress}</span>}
                    </span>
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
                    <span className="request-date">
                      {new Date(request.date).toLocaleDateString()}
                      {request.ipAddress && <span style={{ marginLeft: '1rem', color: '#ef4444' }}>IP: {request.ipAddress}</span>}
                    </span>
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
                    <h3 className="request-airline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {airline.airlineName}
                      {airline.isReviewed && (
                        <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center' }} title="Reviewed">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </h3>
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

        {/* Manage Admins */}
        <div className="card dashboard-card">
          <h2 className="dashboard-card-title">Manage Admins</h2>
          
          {/* Add Admin Form */}
          <form onSubmit={handleAddAdmin} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Admin Email Address"
              className="form-input"
              style={{ flex: 1, margin: 0 }}
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Add Admin</button>
          </form>

          {/* Admins List */}
          <div className="request-list">
            {/* Primary Owner is always shown first */}
            <div className="request-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="request-header" style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                <h3 className="request-airline">evanm.100000@gmail.com</h3>
                <span className="request-date" style={{ marginLeft: '1rem' }}>Primary Owner</span>
                {admins.find(a => a.email.toLowerCase() === 'evanm.100000@gmail.com')?.lastLoginIp && (
                   <span style={{ marginLeft: '1rem', color: '#ef4444', fontSize: '0.8rem' }}>Last IP: {admins.find(a => a.email.toLowerCase() === 'evanm.100000@gmail.com').lastLoginIp}</span>
                )}
              </div>
              <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>System</button>
            </div>

            {admins.filter(a => a.email.toLowerCase() !== 'evanm.100000@gmail.com').map(admin => (
              <div key={admin.id} className="request-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="request-header" style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                  <h3 className="request-airline">{admin.email}</h3>
                  {admin.isTemp && <span style={{ marginLeft: '0.5rem', backgroundColor: '#eab308', color: 'black', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 'bold' }}>Temp Password</span>}
                  {admin.lastLoginIp && (
                     <span style={{ marginLeft: '1rem', color: '#ef4444', fontSize: '0.8rem' }}>Last IP: {admin.lastLoginIp}</span>
                  )}
                </div>
                <button onClick={() => removeAdmin(admin.id)} className="btn btn-danger btn-sm">Remove</button>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
