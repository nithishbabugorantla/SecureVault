import React, { useState, useEffect, useCallback, memo } from 'react';

const ShowPasswordModal = memo(function ShowPasswordModal({ isOpen, onClose, onSubmit, decryptedPassword }) {
  const [masterPin, setMasterPin] = useState('');
  const [showMasterPin, setShowMasterPin] = useState(false);
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
    // onClose is intentionally omitted from deps as it should be stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedPassword]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(masterPin);
    setLoading(false);
  }, [masterPin, onSubmit]);

  const handleClose = useCallback(() => {
    setMasterPin('');
    setShowMasterPin(false);
    setShowDecrypted(false);
    onClose();
  }, [onClose]);

  // Eye icon component for show/hide password
  const EyeIcon = ({ show, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      tabIndex="-1"
    >
      {show ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      )}
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-xl font-bold mb-4">
          {showDecrypted ? 'Decrypted Password' : 'Enter Master PIN'}
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
                Master PIN
              </label>
              <div className="relative">
                <input
                  type={showMasterPin ? "text" : "password"}
                  value={masterPin}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and max 4 characters
                    if (/^\d{0,4}$/.test(value)) {
                      setMasterPin(value);
                    }
                  }}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 4-digit PIN"
                  required
                  pattern="\d{4}"
                  maxLength={4}
                  inputMode="numeric"
                  autoFocus
                />
                <EyeIcon show={showMasterPin} onClick={() => setShowMasterPin(!showMasterPin)} />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Enter your master PIN to decrypt this password
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
});

export default ShowPasswordModal;
