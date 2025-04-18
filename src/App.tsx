import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterForm, LoginForm } from './components/auth';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
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
    </Router>
  );
}

export default App;
