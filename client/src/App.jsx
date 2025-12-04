import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterClient from './pages/RegisterClient';
import RegisterTrainer from './pages/RegisterTrainer';
import Dashboard from './pages/Dashboard';
import WorkoutManager from './pages/WorkoutManager';
import WorkoutDetails from './pages/WorkoutDetails';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import TrainerDirectory from './pages/TrainerDirectory';
import WorkoutTemplates from './pages/WorkoutTemplates';
import WorkoutTemplateSuccess from './pages/WorkoutTemplateSuccess';
import Weightlifting from './pages/Weightlifting';
import Diet from './pages/Diet';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import Loader from './components/Loader';
import { setLoaderCallbacks } from './utils/api';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex justify-center items-center h-screen text-primary">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useContext(AuthContext);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    setLoaderCallbacks(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

  return (
    <>
      <Loader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/register/client" element={user ? <Navigate to="/dashboard" /> : <RegisterClient />} />
        <Route path="/register/trainer" element={user ? <Navigate to="/dashboard" /> : <RegisterTrainer />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/workouts/new" element={
          <PrivateRoute>
            <Layout>
              <WorkoutManager />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/workouts/edit/:id" element={
          <PrivateRoute>
            <Layout>
              <WorkoutManager />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/workouts/:id" element={
          <PrivateRoute>
            <Layout>
              <WorkoutDetails />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <Layout>
              <AdminPanel />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/trainers" element={
          <PrivateRoute>
            <Layout>
              <TrainerDirectory />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/templates" element={
          <PrivateRoute>
            <Layout>
              <WorkoutTemplates />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/workouts/template-success" element={
          <PrivateRoute>
            <Layout>
              <WorkoutTemplateSuccess />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/weightlifting" element={
          <PrivateRoute>
            <Layout>
              <Weightlifting />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/diet" element={
          <PrivateRoute>
            <Layout>
              <Diet />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoaderProvider>
        <Router>
          <AppContent />
        </Router>
      </LoaderProvider>
    </AuthProvider>
  );
}

export default App;
