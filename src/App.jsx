import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RegisterAirline from './pages/RegisterAirline';
import RequestReview from './pages/RequestReview';
import RequestSecondaryReview from './pages/RequestSecondaryReview';
import ReviewDetail from './pages/ReviewDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PostReview from './pages/PostReview';
import CreatePassword from './pages/CreatePassword';
import SetupSecurityQuestion from './pages/SetupSecurityQuestion';
import SecurityChallenge from './pages/SecurityChallenge';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <Header />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-airline" element={<RegisterAirline />} />
          <Route path="/request-review" element={<RequestReview />} />
          <Route path="/request-secondary-review" element={<RequestSecondaryReview />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/setup-security" element={<SetupSecurityQuestion />} />
          <Route path="/security-challenge" element={<SecurityChallenge />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/post-review" element={
            <ProtectedRoute>
              <PostReview />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;
