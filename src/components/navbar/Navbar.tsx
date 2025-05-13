import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Pizza, LineChart, Target, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LineChart size={20} /> },
    { name: 'Workouts', path: '/workout', icon: <Dumbbell size={20} /> },
    { name: 'Nutrition', path: '/nutrition', icon: <Pizza size={20} /> },
    { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Desktop navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`hidden md:flex items-center justify-between fixed top-0 left-0 right-0 z-50 px-6 py-3 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white/70 backdrop-blur-md'
        }`}
      >
        <Link to="/" className="flex items-center">
          <Dumbbell size={28} className="text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">FitSync</span>
        </Link>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <Button 
            variant="outline" 
            size="sm"
            className="ml-2"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </motion.nav>

      {/* Mobile navbar (bottom fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-5 transition-colors ${
                location.pathname === item.path
                  ? 'text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="md:hidden fixed top-0 right-0 z-40 h-full w-64 bg-white shadow-lg"
          >
            <div className="flex flex-col h-full pt-16 pb-20">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-lg font-medium">Menu</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    fullWidth
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;