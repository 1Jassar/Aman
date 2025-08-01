import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CardCreationPage from './pages/CardCreationPage';
import CardManagementPage from './pages/CardManagementPage';
import CardInfoPage from './pages/CardInfoPage';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/card-creation" element={<CardCreationPage />} />
          <Route path="/card-management" element={<CardManagementPage />} />
          <Route path="/card-info" element={<CardInfoPage />} />
        </Routes>
        <InstallPrompt />
      </div>
    </Router>
  );
}

export default App;

