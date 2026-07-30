import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('What was the name of your first pet?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const state = location.state || {};
  const { adminId, email } = state;

  useEffect(() => {
    if (!adminId) {
      navigate('/login');
    }
  }, [adminId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (securityAnswer.trim().length < 3) {
      setError('Security answer must be at least 3 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      let userIp = 'Unknown';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        userIp = ipData.ip;
      } catch (e) {
        console.error("Failed to fetch IP from ipify, trying fallback...", e);
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          const ipData = await ipRes.json();
          userIp = ipData.ip;
        } catch (e2) {
          console.error("Failed to fetch IP from fallback api", e2);
        }
      }

      await updatePassword(adminId, password, securityQuestion, securityAnswer, userIp);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!adminId) return null;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card">
        <h1 className="section-title text-center" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Create Password</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Please set a new password for <strong>{email}</strong>
        </p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />
          
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Security Question</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            This question will be used to verify your identity if you log in from a new IP address or location.
          </p>

          <div className="form-group">
            <label htmlFor="securityQuestion" className="form-label">Select a Question</label>
            <select
              id="securityQuestion"
              className="form-input"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            >
              <option>What was the name of your first pet?</option>
              <option>In what city were you born?</option>
              <option>What is your mother's maiden name?</option>
              <option>What high school did you attend?</option>
              <option>What was the make of your first car?</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="securityAnswer" className="form-label">Your Answer</label>
            <input
              type="text"
              id="securityAnswer"
              className="form-input"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Saving Password...' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
