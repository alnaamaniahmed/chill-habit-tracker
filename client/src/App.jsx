import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SplashScreen from './pages/SplashScreen';


import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import EmailVerification from './components/EmailVerification';

// Wrapper component to get location for AnimatePresence
const AnimatedRoutes = ({ isLoggedIn }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/verify-email' element={<EmailVerification />} />

        {/* Private Routes */}
        <Route path='/habits' element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />

        {/* Redirections */}
        <Route path='/' element={<Navigate to={isLoggedIn ? '/habits' : '/login' } replace />} />
        
        {/* 404 - Catch all unmatched routes */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadApp = async () => {
      try {
        // Step 1: Check fonts loaded (25%)
        setLoadingProgress(25);
        await document.fonts.ready;
        
        // Step 2: Check auth status (50%)
        setLoadingProgress(50);
        const token = localStorage.getItem('token');
        
        // Step 3: Validate token if exists (75%)
        if (token) {
          setLoadingProgress(75);
          try {
            setIsLoggedIn(true);
          } catch (error) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        }
        
        // Step 4: Complete (100%)
        setLoadingProgress(100);
        
      } catch (error) {
        console.error('Loading error:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    loadApp();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const handleStorageChange = () => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(Boolean(token));
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('authChange', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('authChange', handleStorageChange);
      };
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <SplashScreen 
        progress={loadingProgress}
        onComplete={() => {}}
      />
    );
  }

  return (
    <BrowserRouter>
      <AnimatedRoutes isLoggedIn={isLoggedIn} />
    </BrowserRouter>
  )
}

export default App