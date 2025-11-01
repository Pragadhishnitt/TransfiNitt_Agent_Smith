// researcher-dashboard/src/components/Auth/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [],
    strength: { score: 0, label: 'Unknown' }
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  // Validate password as user types
  useEffect(() => {
    const validatePass = async () => {
      if (formData.password) {
        try {
          const response = await fetch('http://localhost:8000/api/auth/validate-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: formData.password })
          });
          const data = await response.json();
          if (data.success) {
            setPasswordValidation({
              isValid: data.isValid,
              errors: data.errors || [],
              strength: data.strength || { score: 0, label: 'Unknown' }
            });
          }
        } catch (err) {
          console.error('Validation error:', err);
        }
      }
    };

    const timeoutId = setTimeout(validatePass, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.password]);

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
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          new_password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error?.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Password reset successful
              </h2>
              <p className="text-gray-600 mb-4">
                Your password has been updated. Redirecting to login...
              </p>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Go to login now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Invalid reset link
              </h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Set new password
            </h2>
            <p className="text-gray-600">
              Choose a strong password for your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  className="pl-12 pr-12 w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
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
                <ul className="mt-2 space-y-1">
                  {passwordValidation.errors.map((err, idx) => (
                    <li key={idx} className="flex items-start text-xs text-red-600">
                      <XCircle className="w-3 h-3 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              )}

              {formData.password && passwordValidation.isValid && (
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  <span>Password meets all requirements</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                  className="pl-12 pr-12 w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {formData.confirmPassword && (
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

            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
              className="w-full flex justify-center items-center py-3 px-4 text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting...
                </>
              ) : (
                'Reset password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;