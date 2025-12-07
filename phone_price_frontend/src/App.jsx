import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PriceSearchPage from './pages/PriceSearchPage';
import ComparePage from './pages/ComparePage';
import AIPicksPage from './pages/AIPicksPage';
import PhoneDetailsPage from './pages/PhoneDetailsPage';
import AboutPage from './pages/AboutPage';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/price-search" element={<PriceSearchPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/ai-picks" element={<AIPicksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/phone/:phoneId" element={<PhoneDetailsPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App
