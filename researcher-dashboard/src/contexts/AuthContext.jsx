import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Decode JWT to get user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Check if token is expired
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('authToken');
            setUser(null);
          } else {
            setUser({
              id: payload.id,
              email: payload.email,
              role: payload.role
            });
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error?.message || data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        const errorMessage = data.error?.details 
          ? data.error.details.join(', ') 
          : data.error?.message || data.message || 'Registration failed';
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // NEW: Set user from OAuth token
  const setAuthFromToken = (token) => {
    try {
      localStorage.setItem('authToken', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.id,
        email: payload.email,
        role: payload.role
      });
      return true;
    } catch (error) {
      console.error('Failed to set auth from token:', error);
      return false;
    }
  };

  const validatePassword = async (password) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      console.log('Validation response:', data); // 👈 Debug log
      
      if (data.success) {
        return {
          isValid: data.isValid,
          errors: data.errors || [],
          strength: {
            score: data.strength?.score || 0,
            label: data.strength?.label || 'Unknown'
          }
        };
      }
      
      return { 
        isValid: false, 
        errors: ['Validation failed'], 
        strength: { score: 0, label: 'Unknown' }
      };
    } catch (error) {
      console.error('Password validation error:', error);
      return { 
        isValid: false, 
        errors: ['Server error'], 
        strength: { score: 0, label: 'Unknown' }
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Server error' };
    }
  };

  const resetPassword = async (token, new_password) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password })
      });
      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Server error' };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password, new_password })
      });
      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Server error' };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    validatePassword,
    forgotPassword,
    resetPassword,
    changePassword,
    setAuthFromToken, // NEW: For OAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};