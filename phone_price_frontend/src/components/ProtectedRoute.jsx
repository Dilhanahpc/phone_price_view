import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authToken = sessionStorage.getItem('adminAuth');
      const authTime = sessionStorage.getItem('adminAuthTime');

      // If no auth token, redirect to login
      if (!authToken || !authTime) {
        navigate('/admin-login');
        return;
      }

      // Check if session is older than 24 hours (optional timeout)
      const sessionAge = Date.now() - parseInt(authTime);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge > maxAge) {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminAuthTime');
        navigate('/admin-login');
      }
    };

    checkAuth();
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
