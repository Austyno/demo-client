import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import theme from './theme';
import './index.css';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ChatModal from './components/ChatModal';

// Clerk Pages
import ClerkDashboard from './pages/ClerkDashboard';
import RequestForm from './pages/RequestForm';
import EditRequestForm from './pages/EditRequestForm';

// Manager Pages
import ManagerDashboard from './pages/ManagerDashboard';
import PendingRequests from './pages/PendingRequests';
import ApprovedRequests from './pages/ApprovedRequests';
import RejectedRequests from './pages/RejectedRequests';

function AppContent() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const handleOpenChat = (event) => {
      setSelectedMessage(event.detail);
    };
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute roles={['CLERK']} />}>
        <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
        <Route path="/create-request" element={<RequestForm />} />
        <Route path="/edit-request/:id" element={<EditRequestForm />} />
      </Route>

      <Route element={<ProtectedRoute roles={['CLERK', 'MANAGER']} />}>
        <Route path="/approved-requests" element={<ApprovedRequests />} />
        <Route path="/rejected-requests" element={<RejectedRequests />} />
      </Route>

      <Route element={<ProtectedRoute roles={['MANAGER']} />}>
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster />
          <Router>
            <AppContent />
          </Router>
          <ChatModal /> 
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
