import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const RegisterAirline = () => {
  const [formData, setFormData] = useState({
    airlineName: '',
    discordLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addAirlineRequest } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 10000)
      );

      await Promise.race([
        addAirlineRequest({
          ...formData,
          status: 'pending',
          requestType: 'registration',
          date: new Date().toISOString()
        }),
        timeoutPromise
      ]);

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
      if (error.message === "Timeout") {
        alert('Request timed out. Firebase is not responding. Please check your internet connection or try again later.');
      } else {
        alert('Failed to submit request. Firebase is blocking the upload. Ensure your database rules are correct.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px' }}>
      <h1 className="section-title text-center mb-6" style={{ marginBottom: '2rem' }}>Register Your Airline</h1>
      
      {submitted ? (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Registration Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your airline has been registered for review. Our staff will process your request shortly.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Return Home</button>
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="airlineName" className="form-label">Airline Name</label>
              <input
                type="text"
                id="airlineName"
                name="airlineName"
                className="form-input"
                value={formData.airlineName}
                onChange={handleChange}
                required
                placeholder="e.g. FlyRoblox Airlines"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="discordLink" className="form-label">Discord Server Link</label>
              <input
                type="url"
                id="discordLink"
                name="discordLink"
                className="form-input"
                value={formData.discordLink}
                onChange={handleChange}
                required
                placeholder="https://discord.gg/..."
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterAirline;
