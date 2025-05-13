import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">
      <header className="py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center">
            <Dumbbell size={32} className="text-primary-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">FitSync</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </main>
      
      <footer className="py-6 px-4 md:px-8 text-center text-sm text-gray-500">
        <p>© 2025 FitSync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;