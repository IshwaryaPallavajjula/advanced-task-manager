import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext';
import { theme, darkTheme } from './utils/theme';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const activeTheme = useMemo(() => (darkMode ? darkTheme : theme), [darkMode]);

  const toggleDark = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', String(!prev));
      return !prev;
    });
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3500}
      >
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout darkMode={darkMode} onToggleDark={toggleDark} />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<AllTasks />} />
                <Route path="/tasks/create" element={<CreateTask />} />
                <Route path="/tasks/edit/:id" element={<EditTask />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
