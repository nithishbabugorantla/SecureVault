import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function Register() {
  const [username, setUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [masterPin, setMasterPin] = useState('');
  const [showMasterPin, setShowMasterPin] = useState(false);
  const [confirmMasterPin, setConfirmMasterPin] = useState('');
  const [showConfirmMasterPin, setShowConfirmMasterPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation rules - matches backend validation
  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      // Matches backend regex pattern exactly
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  // PIN validation - exactly 4 digits
  const validatePin = (pin) => {
    return /^\d{4}$/.test(pin);
  };

  // Memoize validation results to avoid recalculating on every render
  const loginPasswordValidation = useMemo(() => validatePassword(loginPassword), [loginPassword]);

  // Check if passwords are valid
  const isLoginPasswordValid = Object.values(loginPasswordValidation).every(Boolean);
  const isMasterPinValid = validatePin(masterPin);
  const pinsMatch = masterPin && confirmMasterPin && masterPin === confirmMasterPin;
  const isFormValid = isLoginPasswordValid && isMasterPinValid && pinsMatch && username.length >= 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!isLoginPasswordValid) {
      setError('Login password does not meet all requirements');
      return;
    }

    if (!isMasterPinValid) {
      setError('Master PIN must be exactly 4 digits');
      return;
    }

    if (masterPin !== confirmMasterPin) {
      setError('Master PINs do not match');
      return;
    }

    setLoading(true);

    try {
      await authService.register(username, loginPassword, masterPin);
      navigate('/vault');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Password requirement component
  const PasswordRequirement = ({ met, label }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className={`${met ? 'text-green-600' : 'text-gray-400'}`}>
        {met ? '✓' : '○'}
      </span>
      <span className={`${met ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          🔐 SecureVault
        </h2>
        <h3 className="text-xl font-semibold mb-4 text-center">Register</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={3}
              maxLength={50}
            />
            <p className="text-xs text-gray-600 mt-1">
              3-50 characters
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Login Password
            </label>
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <EyeIcon show={showLoginPassword} onClick={() => setShowLoginPassword(!showLoginPassword)} />
            </div>
            {loginPassword && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                <p className="text-xs font-semibold text-gray-700 mb-1">Password Requirements:</p>
                <PasswordRequirement met={loginPasswordValidation.minLength} label="At least 8 characters" />
                <PasswordRequirement met={loginPasswordValidation.hasUpperCase} label="Contains uppercase letter" />
                <PasswordRequirement met={loginPasswordValidation.hasLowerCase} label="Contains lowercase letter" />
                <PasswordRequirement met={loginPasswordValidation.hasNumber} label="Contains number" />
                <PasswordRequirement met={loginPasswordValidation.hasSpecialChar} label="Contains special character (!@#$%^&*...)" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Master PIN (4 digits)
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
                required
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                placeholder="Enter 4-digit PIN"
              />
              <EyeIcon show={showMasterPin} onClick={() => setShowMasterPin(!showMasterPin)} />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Used to encrypt/decrypt your stored passwords
            </p>
            {masterPin && (
              <div className="mt-2">
                {isMasterPinValid ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>✓</span>
                    <span className="font-medium">Valid 4-digit PIN</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>○</span>
                    <span>Must be exactly 4 digits</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Master PIN
            </label>
            <div className="relative">
              <input
                type={showConfirmMasterPin ? "text" : "password"}
                value={confirmMasterPin}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow digits and max 4 characters
                  if (/^\d{0,4}$/.test(value)) {
                    setConfirmMasterPin(value);
                  }
                }}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                placeholder="Re-enter 4-digit PIN"
              />
              <EyeIcon show={showConfirmMasterPin} onClick={() => setShowConfirmMasterPin(!showConfirmMasterPin)} />
            </div>
            {confirmMasterPin && (
              <div className="mt-2">
                {pinsMatch ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>✓</span>
                    <span className="font-medium">PINs match</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <span>✗</span>
                    <span>PINs do not match</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
