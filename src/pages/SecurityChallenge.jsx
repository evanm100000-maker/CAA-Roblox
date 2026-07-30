import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SecurityChallenge = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getSecurityQuestion, verifySecurityChallenge } = useAuth();

  const state = location.state || {};
  const { adminId, email, ip } = state;

  useEffect(() => {
    if (!adminId) {
      navigate('/login');
      return;
    }

    const fetchQuestion = async () => {
      try {
        const q = await getSecurityQuestion(adminId);
        setQuestion(q);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch security question.');
      }
    };
    fetchQuestion();
  }, [adminId, navigate, getSecurityQuestion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }

    setIsSubmitting(true);
    try {
      const isValid = await verifySecurityChallenge(adminId, answer, ip);
      if (isValid) {
        navigate('/admin');
      } else {
        setError('Incorrect answer. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!adminId || !question) return null;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
        <h1 className="section-title text-center" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>Unrecognized IP Address</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <strong>{email}</strong>, we don't recognize the IP address you are logging in from ({ip}). Please answer your security question to verify your identity.
        </p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{question}</label>
            <input
              type="text"
              className="form-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              placeholder="Your answer"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#ef4444', borderColor: '#ef4444' }} disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify Identity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityChallenge;
