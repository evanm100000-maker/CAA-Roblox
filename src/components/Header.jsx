import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-section">
          <img 
            src="/logo.png" 
            alt="CAA Logo" 
            className="header-logo" 
          />
          <span className="logo-text">Civil Aviation Authority</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/request-review" className="request-review-btn">Request a Review</Link>
          
          <div className="dropdown" onMouseLeave={() => setIsDropdownOpen(false)}>
            <button 
              className="nav-link dropdown-toggle"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              More <ChevronDown size={16} />
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu animate-fade-in">
                <Link to="/register-airline" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Register Your Airline</Link>
                <Link to="/request-secondary-review" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Request Secondary Review</Link>
                
                <div className="dropdown-divider"></div>
                
                {!isAuthenticated ? (
                  <Link to="/login" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Log In</Link>
                ) : (
                  <>
                    <Link to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Admin Dashboard</Link>
                    <Link to="/admin/post-review" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Post Review</Link>
                    <button className="dropdown-item text-left w-full text-danger" onClick={handleLogout}>Log Out</button>
                  </>
                )}
              </div>
            )}
          </div>
          
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle-container">
          <button onClick={toggleTheme} className="theme-toggle mobile-theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav animate-fade-in">
          <div className="container">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/request-review" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Request a Review</Link>
            <Link to="/register-airline" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Register Your Airline</Link>
            <Link to="/request-secondary-review" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Request Secondary Review</Link>
            
            {!isAuthenticated ? (
              <Link to="/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
            ) : (
              <>
                <Link to="/admin" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                <Link to="/admin/post-review" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Post Review</Link>
                <button className="mobile-nav-link text-left w-full" onClick={handleLogout}>Log Out</button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
