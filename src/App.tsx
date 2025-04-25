import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterForm, LoginForm } from './components/auth';
import { Dashboard } from './components/monitoring/Dashboard';
import { ProjectProvider } from './context/ProjectContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ProjectProvider>
      <ToastProvider>
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
        </Router>
      </ToastProvider>
    </ProjectProvider>
  );
}

export default App;
