import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PostReview = () => {
  const [formData, setFormData] = useState({
    airlineName: '',
    description: '',
    discordLink: '',
    safety: '5.0',
    realism: '5.0',
    professionalism: '5.0',
    overall: 'Great'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addReview } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let uploadedImageUrl = '';
    
    try {
      if (imageFile) {
        // Create a reference to the file in Firebase Storage
        const imageRef = ref(storage, `reviews/${Date.now()}_${imageFile.name}`);
        // Upload the file
        await uploadBytes(imageRef, imageFile);
        // Get the download URL
        uploadedImageUrl = await getDownloadURL(imageRef);
      }

      await addReview({
        ...formData,
        imageUrl: uploadedImageUrl
      });
      
      alert('Review posted successfully!');
      navigate('/admin');
    } catch (error) {
      console.error("Error posting review:", error);
      alert('Failed to post review. Ensure Firebase Storage is enabled and rules allow writing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 className="section-title mb-6">Post Airline Review</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div className="form-group mb-0">
              <label htmlFor="airlineName" className="form-label">Airline Name</label>
              <input
                type="text"
                id="airlineName"
                name="airlineName"
                className="form-input"
                value={formData.airlineName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="imageUpload" className="form-label">
                Upload Image
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="form-input"
                onChange={handleFileChange}
                style={{ padding: '0.6rem' }}
              />
              {imageFile && <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block'}}>Selected: {imageFile.name}</span>}
            </div>
            
            <div className="form-group mb-0">
              <label htmlFor="discordLink" className="form-label">Discord Link</label>
              <input
                type="url"
                id="discordLink"
                name="discordLink"
                className="form-input"
                value={formData.discordLink}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group mb-0">
              <label htmlFor="description" className="form-label">Review Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Ratings (1-5 or N/A)</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            
            {['safety', 'realism', 'professionalism'].map(ratingField => (
              <div key={ratingField} className="form-group mb-0">
                <label htmlFor={ratingField} className="form-label" style={{ textTransform: 'capitalize' }}>
                  {ratingField}
                </label>
                <select
                  id={ratingField}
                  name={ratingField}
                  className="form-select"
                  value={formData[ratingField]}
                  onChange={handleChange}
                  required
                >
                  <option value="5.0">5.0</option>
                  <option value="4.5">4.5</option>
                  <option value="4.0">4.0</option>
                  <option value="3.5">3.5</option>
                  <option value="3.0">3.0</option>
                  <option value="2.5">2.5</option>
                  <option value="2.0">2.0</option>
                  <option value="1.5">1.5</option>
                  <option value="1.0">1.0</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
            ))}
            
            <div className="form-group mb-0">
              <label htmlFor="overall" className="form-label">
                Overall Rating
              </label>
              <select
                id="overall"
                name="overall"
                className="form-select"
                value={formData.overall}
                onChange={handleChange}
                required
              >
                <option value="Exceptional">Exceptional</option>
                <option value="Great">Great</option>
                <option value="Good">Good</option>
                <option value="Needs Improvement">Needs Improvement</option>
                <option value="Needs urgent improvement">Needs urgent improvement</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? 'Uploading & Posting...' : 'Post Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostReview;
