import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import vaultService from '../services/vaultService';
import PasswordCard from '../components/PasswordCard';
import ShowPasswordModal from '../components/ShowPasswordModal';
import AddPasswordModal from '../components/AddPasswordModal';

function VaultDashboard() {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [addPasswordModal, setAddPasswordModal] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const navigate = useNavigate();

  // Memoize loadPasswords to prevent recreation on every render
  const loadPasswords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vaultService.getAllPasswords();
      setPasswords(data);
      setError('');
    } catch (err) {
      setError('Failed to load passwords');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadPasswords();
  }, [navigate, loadPasswords]);

  // Memoize callback functions to prevent unnecessary re-renders of child components
  const handleShowPassword = useCallback((id) => {
    setSelectedPasswordId(id);
    setDecryptedPassword('');
    setShowPasswordModal(true);
  }, []);

  const handleDecryptPassword = useCallback(async (masterPin) => {
    try {
      const response = await vaultService.showPassword(selectedPasswordId, masterPin);
      setDecryptedPassword(response.password);
    } catch (err) {
      alert(err.response?.data || 'Failed to decrypt password');
      setShowPasswordModal(false);
    }
  }, [selectedPasswordId]);

  const handleAddPassword = useCallback(async (appName, appUsername, password, masterPin) => {
    try {
      await vaultService.addPassword(appName, appUsername, password, masterPin);
      setAddPasswordModal(false);
      loadPasswords();
    } catch (err) {
      alert(err.response?.data || 'Failed to add password');
    }
  }, [loadPasswords]);

  const handleDeletePassword = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        await vaultService.deletePassword(id);
        loadPasswords();
      } catch (err) {
        alert('Failed to delete password');
      }
    }
  }, [loadPasswords]);

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate('/login');
  }, [navigate]);

  const handleCloseShowPasswordModal = useCallback(() => {
    setShowPasswordModal(false);
    setDecryptedPassword('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔐 SecureVault</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {authService.getUsername()}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Password Vault</h2>
          <button
            onClick={() => setAddPasswordModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Password
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading passwords...</p>
          </div>
        ) : passwords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No passwords stored yet</p>
            <button
              onClick={() => setAddPasswordModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add Your First Password
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {passwords.map((entry) => (
              <PasswordCard
                key={entry.id}
                entry={entry}
                onShow={handleShowPassword}
                onDelete={handleDeletePassword}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ShowPasswordModal
        isOpen={showPasswordModal}
        onClose={handleCloseShowPasswordModal}
        onSubmit={handleDecryptPassword}
        decryptedPassword={decryptedPassword}
      />

      <AddPasswordModal
        isOpen={addPasswordModal}
        onClose={() => setAddPasswordModal(false)}
        onSubmit={handleAddPassword}
      />
    </div>
  );
}

export default VaultDashboard;
