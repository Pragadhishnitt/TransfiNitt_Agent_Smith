import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Sessions from './pages/Sessions';
import Respondents from './pages/Respondents';
import Insights from './pages/Insights';
import SurveyGenerator from './pages/SurveyGenerator';
import Incentives from './pages/Incentives';
import Sample from './pages/sample';

function AppContent() {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'false' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-boxdark">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-boxdark">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <Layout isDark={isDark} setIsDark={setIsDark}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/sample" element={<Sample />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/respondents" element={<Respondents />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/survey" element={<SurveyGenerator />} />
          <Route path="/incentives" element={<Incentives />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
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
