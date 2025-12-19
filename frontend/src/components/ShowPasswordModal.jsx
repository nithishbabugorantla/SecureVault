import React, { useState, useEffect } from 'react';

function ShowPasswordModal({ isOpen, onClose, onSubmit, decryptedPassword }) {
  const [masterPassword, setMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDecrypted, setShowDecrypted] = useState(false);

  useEffect(() => {
    if (decryptedPassword) {
      setShowDecrypted(true);
      // Auto-hide decrypted password after 30 seconds for security
      const timer = setTimeout(() => {
        setShowDecrypted(false);
        onClose();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [decryptedPassword, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(masterPassword);
    setLoading(false);
  };

  const handleClose = () => {
    setMasterPassword('');
    setShowDecrypted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-xl font-bold mb-4">
          {showDecrypted ? 'Decrypted Password' : 'Enter Master Password'}
        </h3>

        {showDecrypted ? (
          <div>
            <div className="bg-green-50 border border-green-300 p-4 rounded mb-4">
              <p className="text-sm text-gray-700 mb-2">Password:</p>
              <p className="text-lg font-mono font-bold text-green-700 break-all">
                {decryptedPassword}
              </p>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              This password will be hidden automatically in 30 seconds.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Master Password
              </label>
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
              <p className="text-xs text-gray-600 mt-1">
                Enter your master password to decrypt this password
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Decrypting...' : 'Decrypt'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ShowPasswordModal;
