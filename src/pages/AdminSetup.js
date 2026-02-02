// src/pages/AdminSetup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import './AdminSetup.css';

const AdminSetup = ({ onAdminCreated }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { email, username, password, confirmPassword } = formData;
    
    if (!email || !username || !password || !confirmPassword) {
      toast.error('All fields are required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Using Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            role: 'admin',
            is_initial_admin: true
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success('Admin account created successfully!');
        
        // Create admin profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username: formData.username,
              email: formData.email,
              role: 'admin',
              is_initial_admin: true,
              created_at: new Date().toISOString(),
            }
          ]);
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
        
        // Store admin creation flag
        localStorage.setItem('admin_created', 'true');
        localStorage.setItem('admin_email', formData.email);
        
        // Call parent callback
        if (onAdminCreated) {
          onAdminCreated();
        }
        
        // Navigate to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create admin account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <div className="admin-setup-header">
          <h1>Welcome to Sman Farm Management</h1>
          <p>Let's create your first admin account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-setup-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min. 6 characters)"
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-note">
            <p>
              <strong>Note:</strong> This will create the first admin account. 
              Make sure to remember your credentials as this is the only account 
              with full system access.
            </p>
          </div>
          
          <button 
            type="submit" 
            className="setup-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;