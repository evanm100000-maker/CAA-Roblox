import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ReviewCard from '../components/ReviewCard';
import './Home.css';

const Home = () => {
  const { reviews } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter(review => 
    review.airlineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-page animate-fade-in">
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">Official Airline Certification & Review</h1>
          <p className="hero-subtitle">
            Civil Aviation Authority Roblox is the leading airline evaluation group on the platform, specialising in assessing carriers on key standards such as safety, professionalism, and realism.
          </p>
          <div className="hero-actions">
            <Link to="/request-review" className="btn btn-primary btn-lg">
              Request an Initial Review
            </Link>
            <Link to="/request-secondary-review" className="btn btn-outline btn-lg hero-outline-btn">
              Request Review
            </Link>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Published Airline Reviews</h2>
            <div className="section-divider"></div>
            
            <div className="search-container">
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search for an airline..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {filteredReviews.length === 0 ? (
            <div className="empty-state">
              <p>{searchQuery ? 'No airlines found matching your search.' : 'No airline reviews have been published yet. Check back soon.'}</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {filteredReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
