import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import AuthError from '../components/AuthError';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePassword } from '../utils/validation';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const { formData, errors, handleChange, validateForm } = useForm(
    {
      email: '',
      password: '',
    },
    {
      email: validateEmail,
      password: validatePassword,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setAuthError('');
    setSuccessMessage('');

    try {
      await login(formData.email, formData.password);
      navigate('/chat');
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <Brain className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-100">Welcome back</h2>
        <p className="text-gray-300">Continue your journey with Jarvie</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-500 text-sm">
            {successMessage}
          </div>
        )}
        {authError && <AuthError message={authError} />}
        
        <FormInput
          label="Email"
          name="email"
          type="email"
          icon={<Mail className="h-5 w-5" />}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          disabled={isLoading}
          className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
          labelClassName="text-gray-300"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          icon={<Lock className="h-5 w-5" />}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={isLoading}
          className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
          labelClassName="text-gray-300"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-300">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}