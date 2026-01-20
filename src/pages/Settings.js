import React, { useState } from 'react';
import { FiSave, FiUser, FiBell, FiShield, FiGlobe, FiDatabase, FiMail, FiLock, FiTrash2, FiUpload, FiDownload } from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    farmName: 'Sman Farm',
    ownerName: 'Musa Sule',
    email: 'musa@smanfarm.com',
    phone: '+234 812 345 6789',
    location: 'Lagos, Nigeria',
    address: '123 Farm Road, Agricultural Zone',
    currency: 'NGN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24-hour',
    notifications: true,
    emailReports: true,
    smsAlerts: true,
    autoBackup: true,
    backupFrequency: 'daily',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleInputChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSaveSettings = () => {
    // In a real app, you would save to backend here
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    alert('Data export started. You will receive an email shortly.');
  };

  const handleImportData = () => {
    // Trigger file input click
    document.getElementById('import-file').click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`Importing data from: ${file.name}`);
      // Handle file import logic here
    }
  };

  const handleBackupNow = () => {
    alert('Backup process started. Your data is being saved.');
  };

  const handlePasswordChange = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (settings.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    alert('Password changed successfully!');
    setSettings({
      ...settings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all data will be lost permanently.'
    );
    if (confirmDelete) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FiUser /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'data', label: 'Data Management', icon: <FiDatabase /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'appearance', label: 'Appearance', icon: <FiGlobe /> },
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <button className="btn btn-primary" onClick={handleSaveSettings}>
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="settings-info">
            <h4>Farm Information</h4>
            <div className="farm-summary">
              <div className="summary-item">
                <span>Farm ID:</span>
                <strong>SMAN-001</strong>
              </div>
              <div className="summary-item">
                <span>Created:</span>
                <strong>2024-01-15</strong>
              </div>
              <div className="summary-item">
                <span>Version:</span>
                <strong>1.0.0</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              
              <div className="settings-form">
                <div className="form-section">
                  <h4>Farm Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Farm Name *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={settings.farmName}
                        onChange={(e) => handleInputChange('farmName', e.target.value)}
                        placeholder="Enter farm name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Owner Name *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={settings.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        placeholder="Enter owner name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        className="form-control"
                        value={settings.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control"
                        value={settings.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Location</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={settings.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter location"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Address</label>
                      <textarea 
                        className="form-control"
                        value={settings.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter complete address"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Regional Settings</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Currency</label>
                      <select 
                        className="form-control"
                        value={settings.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                      >
                        <option value="NGN">Nigerian Naira (₦)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Date Format</label>
                      <select 
                        className="form-control"
                        value={settings.dateFormat}
                        onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Time Format</label>
                      <select 
                        className="form-control"
                        value={settings.timeFormat}
                        onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                      >
                        <option value="24-hour">24-hour (14:30)</option>
                        <option value="12-hour">12-hour (2:30 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              
              <div className="notification-settings">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Push Notifications</h4>
                    <p>Receive instant notifications for important activities and alerts</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications}
                      onChange={(e) => handleInputChange('notifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Email Reports</h4>
                    <p>Receive daily, weekly, and monthly reports via email</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.emailReports}
                      onChange={(e) => handleInputChange('emailReports', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>SMS Alerts</h4>
                    <p>Receive critical alerts via SMS (requires phone verification)</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.smsAlerts}
                      onChange={(e) => handleInputChange('smsAlerts', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-schedule">
                  <h4>Report Schedule</h4>
                  <div className="schedule-options">
                    <div className="schedule-option">
                      <input type="radio" id="daily" name="schedule" defaultChecked />
                      <label htmlFor="daily">Daily Reports</label>
                    </div>
                    <div className="schedule-option">
                      <input type="radio" id="weekly" name="schedule" />
                      <label htmlFor="weekly">Weekly Reports (Monday)</label>
                    </div>
                    <div className="schedule-option">
                      <input type="radio" id="monthly" name="schedule" />
                      <label htmlFor="monthly">Monthly Reports (1st of month)</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h3>Data Management</h3>
              
              <div className="data-settings">
                <div className="data-item">
                  <div className="data-info">
                    <h4>Auto Backup</h4>
                    <p>Automatically backup your farm data regularly</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.autoBackup}
                      onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                {settings.autoBackup && (
                  <div className="backup-settings">
                    <div className="form-group">
                      <label>Backup Frequency</label>
                      <select 
                        className="form-control"
                        value={settings.backupFrequency}
                        onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div className="backup-stats">
                      <div className="stat">
                        <span>Last Backup:</span>
                        <strong>Today, 02:00 AM</strong>
                      </div>
                      <div className="stat">
                        <span>Next Backup:</span>
                        <strong>Tomorrow, 02:00 AM</strong>
                      </div>
                      <div className="stat">
                        <span>Storage Used:</span>
                        <strong>25.4 MB / 1 GB</strong>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="data-actions">
                  <button className="btn btn-primary" onClick={handleBackupNow}>
                    <FiDatabase /> Backup Now
                  </button>
                  
                  <button className="btn btn-secondary" onClick={handleExportData}>
                    <FiDownload /> Export Data
                  </button>
                  
                  <button className="btn btn-secondary" onClick={handleImportData}>
                    <FiUpload /> Import Data
                  </button>
                  
                  <input
                    type="file"
                    id="import-file"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept=".json,.csv"
                  />
                </div>
                
                <div className="data-info-card">
                  <h5>Data Statistics</h5>
                  <div className="data-stats">
                    <div className="data-stat">
                      <span>Total Records:</span>
                      <strong>1,245</strong>
                    </div>
                    <div className="data-stat">
                      <span>Fish Farming:</span>
                      <strong>450 records</strong>
                    </div>
                    <div className="data-stat">
                      <span>Poultry:</span>
                      <strong>620 records</strong>
                    </div>
                    <div className="data-stat">
                      <span>Expenses:</span>
                      <strong>175 records</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              
              <div className="security-settings">
                <div className="password-section">
                  <h4>Change Password</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input 
                        type="password" 
                        className="form-control"
                        value={settings.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        className="form-control"
                        value={settings.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        placeholder="Enter new password"
                      />
                      <small className="form-text">
                        Password must be at least 6 characters long
                      </small>
                    </div>
                    
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        className="form-control"
                        value={settings.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <button className="btn btn-primary" onClick={handlePasswordChange}>
                    <FiLock /> Change Password
                  </button>
                </div>
                
                <div className="security-actions">
                  <div className="security-action">
                    <h5>Two-Factor Authentication</h5>
                    <p>Add an extra layer of security to your account</p>
                    <button className="btn btn-secondary">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="security-action">
                    <h5>Login History</h5>
                    <p>View recent login activity on your account</p>
                    <button className="btn btn-secondary">
                      View History
                    </button>
                  </div>
                </div>
                
                <div className="danger-zone">
                  <h4>Danger Zone</h4>
                  <div className="danger-action">
                    <div>
                      <h5>Delete Account</h5>
                      <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button className="btn btn-danger" onClick={handleDeleteAccount}>
                      <FiTrash2 /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance Settings</h3>
              
              <div className="appearance-settings">
                <div className="theme-section">
                  <h4>Theme</h4>
                  <div className="theme-options">
                    <div className="theme-option">
                      <input type="radio" id="light" name="theme" defaultChecked />
                      <label htmlFor="light">
                        <div className="theme-preview light"></div>
                        <span>Light</span>
                      </label>
                    </div>
                    <div className="theme-option">
                      <input type="radio" id="dark" name="theme" />
                      <label htmlFor="dark">
                        <div className="theme-preview dark"></div>
                        <span>Dark</span>
                      </label>
                    </div>
                    <div className="theme-option">
                      <input type="radio" id="auto" name="theme" />
                      <label htmlFor="auto">
                        <div className="theme-preview auto"></div>
                        <span>Auto (System)</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="language-section">
                  <h4>Language</h4>
                  <select className="form-control">
                    <option>English</option>
                    <option>Yoruba</option>
                    <option>Hausa</option>
                    <option>Igbo</option>
                  </select>
                </div>
                
                <div className="display-section">
                  <h4>Display Settings</h4>
                  <div className="display-options">
                    <div className="display-option">
                      <input type="checkbox" id="compact" defaultChecked />
                      <label htmlFor="compact">Compact View</label>
                    </div>
                    <div className="display-option">
                      <input type="checkbox" id="animations" defaultChecked />
                      <label htmlFor="animations">Enable Animations</label>
                    </div>
                    <div className="display-option">
                      <input type="checkbox" id="high-contrast" />
                      <label htmlFor="high-contrast">High Contrast Mode</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;