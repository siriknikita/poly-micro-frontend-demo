import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterForm, LoginForm } from './components/auth';
import { Dashboard } from './components/monitoring/Dashboard';
import { ProjectProvider } from './context/ProjectContext';
import { ToastProvider } from './context/ToastContext';
import { ReleaseProvider } from './context/ReleaseContext';
import { ReleaseModal, ReleaseNotification, ReleaseDebug } from './components/releases';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import autoSyncReleases from './utils/releaseSync';

function App() {
  // Auto-sync releases when the app starts
  useEffect(() => {
    autoSyncReleases();
  }, []);

  return (
    <ProjectProvider>
      <ToastProvider>
        <ReleaseProvider>
          <Router>
            <Routes>
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/monitoring" element={<Dashboard />} />
              <Route path="/cicd" element={<Dashboard />} />
              <Route path="/testing" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer />
            <ReleaseModal />
            <ReleaseNotification />
            <ReleaseDebug />
          </Router>
        </ReleaseProvider>
      </ToastProvider>
    </ProjectProvider>
  );
}

export default App;
