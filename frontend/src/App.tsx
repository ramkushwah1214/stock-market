import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import BeginnerMode from './pages/BeginnerMode';
import InvestorPortfolio from './pages/InvestorPortfolio';
import StockAnalysis from './pages/StockAnalysis';
import SmartAdvisor from './pages/SmartAdvisor';
import StockComparison from './pages/StockComparison';
import NewsSentiment from './pages/NewsSentiment';
import Chatbot from './pages/Chatbot';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationsSettings from './pages/settings/NotificationsSettings';
import UPISettings from './pages/settings/UPISettings';
import PasswordSettings from './pages/settings/PasswordSettings';
import PINSettings from './pages/settings/PINSettings';
import DevicesSettings from './pages/settings/DevicesSettings';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage isLoginRoute={true} />} />
          <Route path="/signup" element={<AuthPage isLoginRoute={false} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="beginner" element={<BeginnerMode />} />
            <Route path="portfolio" element={<InvestorPortfolio />} />
            <Route path="analysis" element={<StockAnalysis />} />
            <Route path="advisor" element={<SmartAdvisor />} />
            <Route path="compare" element={<StockComparison />} />
            <Route path="news" element={<NewsSentiment />} />
            <Route path="chat" element={<Chatbot />} />
            <Route path="profile" element={<Profile />} />
            
            <Route path="settings">
              <Route index element={<Settings />} />
              <Route path="notifications" element={<NotificationsSettings />} />
              <Route path="upi" element={<UPISettings />} />
              <Route path="password" element={<PasswordSettings />} />
              <Route path="pin" element={<PINSettings />} />
              <Route path="devices" element={<DevicesSettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
