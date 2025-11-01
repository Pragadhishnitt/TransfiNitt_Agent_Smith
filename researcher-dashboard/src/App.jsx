import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthCallback from './components/Auth/AuthCallback';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Sessions from './pages/Sessions';
import Respondents from './pages/Respondents';
import Insights from './pages/Insights';
import SurveyGenerator from './pages/SurveyGenerator';
import Incentives from './pages/Incentives';
import Sample from './pages/sample';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

function AppContent() {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem('darkMode') === 'false' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-boxdark">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-boxdark">
        {!user ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <Layout isDark={isDark} setIsDark={setIsDark}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/sample" element={<Sample />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/respondents" element={<Respondents />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/survey" element={<SurveyGenerator />} />
              <Route path="/incentives" element={<Incentives />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="font-inter">
          <AppContent />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
