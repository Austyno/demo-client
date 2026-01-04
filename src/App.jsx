import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './index.css';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Clerk Pages
import ClerkDashboard from './pages/ClerkDashboard';
import RequestForm from './pages/RequestForm';
import EditRequestForm from './pages/EditRequestForm';

// Manager Pages
import ManagerDashboard from './pages/ManagerDashboard';
import PendingRequests from './pages/PendingRequests';
import ApprovedRequests from './pages/ApprovedRequests';
import RejectedRequests from './pages/RejectedRequests';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute roles={['CLERK']} />}>
              <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
              <Route path="/create-request" element={<RequestForm />} />
              <Route path="/edit-request/:id" element={<EditRequestForm />} />
            </Route>

            <Route element={<ProtectedRoute roles={['MANAGER']} />}>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route path="/pending-requests" element={<PendingRequests />} />
              <Route path="/approved-requests" element={<ApprovedRequests />} />
              <Route path="/rejected-requests" element={<RejectedRequests />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
