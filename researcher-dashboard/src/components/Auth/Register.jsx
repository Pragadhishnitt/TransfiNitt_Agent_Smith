import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, validatePassword, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [],
    strength: { score: 0, label: 'Unknown' }
  });
  const [validatingPassword, setValidatingPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Validate password as user types
  useEffect(() => {
    const validatePass = async () => {
      if (formData.password) {
        setValidatingPassword(true);
        const validation = await validatePassword(formData.password);
        setPasswordValidation(validation);
        setValidatingPassword(false);
      } else {
        setPasswordValidation({
          isValid: false,
          errors: [],
          strength: { score: 0, label: 'Unknown' }
        });
      }
    };

    const timeoutId = setTimeout(validatePass, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.password, validatePassword]);

  const getStrengthColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-blue-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrengthBarColor = (score) => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-blue-500';
    if (score >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.length ? passwordValidation.errors.join(', ') : 'Password does not meet requirements');
      setLoading(false);
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      role: 'researcher',
    });
    
    if (result.success) {
      console.log('Registration successful, redirecting...');
      // User is set in AuthContext, useEffect above will handle redirect
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleOAuthRegister = (provider) => {
    window.location.href = `http://localhost:8000/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Create account
            </h2>
            <p className="text-gray-600">
              Join as a researcher
            </p>
          </div>
        
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-12 w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-12 pr-12 w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.password && passwordValidation.strength && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={`text-xs font-semibold ${getStrengthColor(passwordValidation.strength.score)}`}>
                        {passwordValidation.strength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(passwordValidation.strength.score)}`}
                        style={{ width: `${(passwordValidation.strength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {formData.password && passwordValidation.errors.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-gray-700">Requirements:</p>
                    <ul className="space-y-1">
                      {passwordValidation.errors.map((err, idx) => (
                        <li key={idx} className="flex items-start text-xs text-red-600">
                          <XCircle className="w-3 h-3 mr-1.5 flex-shrink-0 mt-0.5" />
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.password && passwordValidation.errors.length === 0 && passwordValidation.isValid && (
                  <div className="mt-3 flex items-center text-xs text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    <span>Password meets all requirements</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-12 pr-12 w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.confirmPassword && formData.password && (
                  <div className={`mt-2 flex items-center text-xs ${
                    formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1.5" />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || validatingPassword || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleOAuthRegister('google')}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthRegister('linkedin')}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="#0077B5" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Sign up with LinkedIn
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;