import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('authToken', token);
      
      // Verify token and get user data
      fetch('http://localhost:8000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          navigate('/dashboard');
        } else {
          console.error('Token verification failed');
          navigate('/login');
        }
      })
      .catch(err => {
        console.error('Auth callback error:', err);
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-boxdark">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
    </div>
  );
};

export default AuthCallback;