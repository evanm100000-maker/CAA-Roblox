import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Star, StarHalf, ArrowLeft, Link as LinkIcon, Check } from 'lucide-react';
import '../components/ReviewCard.css';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reviews } = useData();
  const [copied, setCopied] = useState(false);
  
  const review = reviews.find(r => r.id.toString() === id);

  if (!review) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Review not found</h2>
        <p style={{ marginTop: '1rem' }}>The review you are looking for does not exist or has been deleted.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/review/${review.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderStars = (rating) => {
    if (rating === 'N/A' || rating === '' || rating == null) {
      return <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500}}>N/A</span>;
    }
    const numRating = Number(rating);
    return Array.from({ length: 5 }).map((_, i) => {
      const starVal = i + 1;
      if (numRating >= starVal) {
        return <Star key={i} size={18} className="star-filled" fill="currentColor" />;
      } else if (numRating >= starVal - 0.5) {
        return <StarHalf key={i} size={18} className="star-filled" fill="currentColor" />;
      } else {
        return <Star key={i} size={18} className="star-empty" />;
      }
    });
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Reviews
      </button>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {review.imageUrl && (
          <div style={{ width: '100%', height: '350px', backgroundColor: 'var(--border-color)' }}>
            <img 
              src={review.imageUrl} 
              alt={review.airlineName} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}
        
        <div style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--primary-blue)' }}>
              {review.airlineName}
            </h1>
            
            <button 
              onClick={handleCopyLink} 
              className="btn btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {copied ? <Check size={16} className="text-success" /> : <LinkIcon size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          
          <div className="overall-rating" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Overall Rating:</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
              {review.overall || 'N/A'}
            </span>
          </div>

          <div style={{ marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
            {review.description.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '1rem' }}>{paragraph}</p>
            ))}
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Detailed Ratings
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div className="rating-item">
              <span className="rating-label" style={{ fontSize: '1rem' }}>Safety</span>
              <div className="rating-stars" style={{ gap: '0.25rem' }}>{renderStars(review.safety)}</div>
            </div>
            <div className="rating-item">
              <span className="rating-label" style={{ fontSize: '1rem' }}>Realism</span>
              <div className="rating-stars" style={{ gap: '0.25rem' }}>{renderStars(review.realism)}</div>
            </div>
            <div className="rating-item">
              <span className="rating-label" style={{ fontSize: '1rem' }}>Aircraft/Airport</span>
              <div className="rating-stars" style={{ gap: '0.25rem' }}>{renderStars(review.aircraft)}</div>
            </div>
          </div>
          
          {review.discordLink && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a href={review.discordLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', backgroundColor: '#5865F2', borderColor: '#5865F2' }}>
                Join the {review.airlineName} Discord Server
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
