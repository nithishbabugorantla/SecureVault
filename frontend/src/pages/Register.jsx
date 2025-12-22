import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function Register() {
  const [username, setUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('');
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

  // Memoize validation results to avoid recalculating on every render
  const loginPasswordValidation = useMemo(() => validatePassword(loginPassword), [loginPassword]);
  const masterPasswordValidation = useMemo(() => validatePassword(masterPassword), [masterPassword]);

  // Check if passwords are valid
  const isLoginPasswordValid = Object.values(loginPasswordValidation).every(Boolean);
  const isMasterPasswordValid = Object.values(masterPasswordValidation).every(Boolean);
  const passwordsMatch = masterPassword && confirmMasterPassword && masterPassword === confirmMasterPassword;
  const isFormValid = isLoginPasswordValid && isMasterPasswordValid && passwordsMatch && username.length >= 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!isLoginPasswordValid) {
      setError('Login password does not meet all requirements');
      return;
    }

    if (!isMasterPasswordValid) {
      setError('Master password does not meet all requirements');
      return;
    }

    if (masterPassword !== confirmMasterPassword) {
      setError('Master passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authService.register(username, loginPassword, masterPassword);
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
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
              Master Password
            </label>
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              Used to encrypt/decrypt your stored passwords
            </p>
            {masterPassword && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                <p className="text-xs font-semibold text-gray-700 mb-1">Password Requirements:</p>
                <PasswordRequirement met={masterPasswordValidation.minLength} label="At least 8 characters" />
                <PasswordRequirement met={masterPasswordValidation.hasUpperCase} label="Contains uppercase letter" />
                <PasswordRequirement met={masterPasswordValidation.hasLowerCase} label="Contains lowercase letter" />
                <PasswordRequirement met={masterPasswordValidation.hasNumber} label="Contains number" />
                <PasswordRequirement met={masterPasswordValidation.hasSpecialChar} label="Contains special character (!@#$%^&*...)" />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Master Password
            </label>
            <input
              type="password"
              value={confirmMasterPassword}
              onChange={(e) => setConfirmMasterPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {confirmMasterPassword && (
              <div className="mt-2">
                {passwordsMatch ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>✓</span>
                    <span className="font-medium">Passwords match</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <span>✗</span>
                    <span>Passwords do not match</span>
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
