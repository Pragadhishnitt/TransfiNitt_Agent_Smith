  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { AuthProvider, useAuth } from './contexts/AuthContext';
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

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // if (!user) {
    //   return (
    //     <Router>
    //       <Routes>
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/register" element={<Register />} />
    //         <Route path="*" element={<Navigate to="/login" replace />} />
    //       </Routes>
    //     </Router>
    //   );
    // }

    return (
      <Router>
        <Layout>
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
        <AppContent />
      </AuthProvider>
    );
  }

  export default App;
