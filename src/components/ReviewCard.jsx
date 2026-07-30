import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, StarHalf, Trash2, Link as LinkIcon, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const { isAuthenticated } = useAuth();
  const { deleteReview } = useData();
  const [copied, setCopied] = useState(false);

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
        return <Star key={i} size={14} className="star-filled" fill="currentColor" />;
      } else if (numRating >= starVal - 0.5) {
        return <StarHalf key={i} size={14} className="star-filled" fill="currentColor" />;
      } else {
        return <Star key={i} size={14} className="star-empty" />;
      }
    });
  };

  return (
    <div className="card review-card animate-fade-in" style={{ position: 'relative' }}>
      
      {isAuthenticated && (
        <button 
          onClick={() => deleteReview(review.id)}
          className="btn btn-danger"
          style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.4rem', zIndex: 10, borderRadius: '50%' }}
          title="Delete Review"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="review-image-container">
        {review.imageUrl ? (
          <img src={review.imageUrl} alt={review.airlineName} className="review-image" />
        ) : (
          <div className="review-image-placeholder">No Image Available</div>
        )}
      </div>
      
      <div className="review-content">
        <h3 className="review-title">{review.airlineName}</h3>
        <p className="review-desc">{review.description}</p>
        
        <div className="ratings-grid">
          <div className="rating-item">
            <span className="rating-label">Safety</span>
            <div className="rating-stars">{renderStars(review.safety)}</div>
          </div>
          <div className="rating-item">
            <span className="rating-label">Realism</span>
            <div className="rating-stars">{renderStars(review.realism)}</div>
          </div>
          <div className="rating-item">
            <span className="rating-label">Professionalism</span>
            <div className="rating-stars">{renderStars(review.professionalism)}</div>
          </div>
        </div>
        
        <div className="review-footer">
          <div className="overall-rating">
            <span className="overall-label">Overall Rating:</span>
            <span className="overall-score">
              {review.overall || 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="review-card-actions">
          <Link to={`/review/${review.id}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
            Full Review
          </Link>
          <button onClick={handleCopyLink} className="btn btn-outline" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }} title="Copy Link">
            {copied ? <Check size={16} className="text-success" /> : <LinkIcon size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
