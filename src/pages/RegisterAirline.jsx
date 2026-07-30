import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const RegisterAirline = () => {
  const [formData, setFormData] = useState({
    airlineName: '',
    discordLink: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { addAirlineRequest } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAirlineRequest({
      ...formData,
      status: 'pending',
      date: new Date().toISOString()
    });
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px' }}>
      <h1 className="section-title text-center mb-6" style={{ marginBottom: '2rem' }}>Register Your Airline</h1>
      
      {submitted ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>Registration Submitted!</h2>
          <p>Your airline has been registered for review. Our staff will process your request shortly.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Redirecting to home...</p>
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
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Submit Registration
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterAirline;
