import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FishFarming from './pages/FishFarming';
import Poultry from './pages/Poultry';
import Livestock from './pages/Livestock';
import Expenses from './pages/Expenses';
import Investments from './pages/Investments';
import Reports from './pages/Reports';
import Equipment from './pages/Equipment';
import Settings from './pages/Settings';
import AdminSetup from './pages/AdminSetup';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { getCurrentUser } from './lib/supabase';
import toast from 'react-hot-toast';

// Create Auth Context
export const AuthContext = createContext();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (for login page)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout Component for authenticated routes
const MainLayout = ({ children, sidebarOpen, setSidebarOpen }) => {
  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="app">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onLogout={handleLogout} 
      />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  // Check if admin exists and user is authenticated
  useEffect(() => {
    checkAuth();
    checkAdminExists();
  }, []);

  const checkAuth = async () => {
    try {
      const { user, error } = await getCurrentUser();
      if (error) {
        console.error('Auth check error:', error);
      }
      setUser(user);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminExists = async () => {
    // In a real app, you would check your database for admin users
    // For now, we'll check localStorage
    const hasAdmin = localStorage.getItem('admin_created') === 'true';
    setAdminExists(hasAdmin);
  };

  const handleLogin = async (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      // Clear local state
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      
      // If using Supabase auth, you would also sign out from there
      // await supabase.auth.signOut();
      
      // Show success message
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAdminCreated = () => {
    setAdminExists(true);
    localStorage.setItem('admin_created', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      <ToastProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#4CAF50',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#4CAF50',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#f44336',
                  color: '#fff',
                },
              },
              loading: {
                duration: Infinity,
                style: {
                  background: '#2196F3',
                  color: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Initial setup route - only accessible when no admin exists */}
            {!adminExists && !loading && (
              <Route 
                path="/" 
                element={<AdminSetup onAdminCreated={handleAdminCreated} />} 
              />
            )}
            
            {/* Login Route - Only accessible when not authenticated */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login onLogin={handleLogin} />
                </PublicRoute>
              } 
            />
            
            {/* Admin Setup Route */}
            <Route 
              path="/admin-setup" 
              element={
                !adminExists ? (
                  <AdminSetup onAdminCreated={handleAdminCreated} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/fish-farming" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <FishFarming />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/poultry" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Poultry />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/livestock" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Livestock />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/expenses" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Expenses />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/investments" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Investments />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/equipment" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Equipment />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthContext.Provider>
  );
}

export default App;