import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FishFarming from './pages/FishFarming';
import Poultry from './pages/Poultry';
import Livestock from './pages/Livestock';
import Expenses from './pages/Expenses';
import Investments from './pages/Investments';
import Reports from './pages/Reports';
import Equipment from './pages/Equipment';
import Settings from './pages/Settings';
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ToastProvider>
      <Router>
        <div className="app">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fish-farming" element={<FishFarming />} />
              <Route path="/poultry" element={<Poultry />} />
              <Route path="/livestock" element={<Livestock />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;