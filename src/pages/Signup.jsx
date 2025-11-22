import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import AuthError from '../components/AuthError';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '../utils/validation';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const { formData, errors, handleChange, validateForm } = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: validateConfirmPassword,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setAuthError('');

    try {
      await signup(formData.email, formData.password);
      // Redirect to login page after successful signup
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please log in to continue.' 
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <Brain className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-100">Create your account</h2>
        <p className="text-gray-300">Start your mental wellness journey today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {authError && <AuthError message={authError} />}

        <FormInput
          label="Full Name"
          name="name"
          type="text"
          icon={<User className="h-5 w-5" />}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          disabled={isLoading}
          className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
          labelClassName="text-gray-300"
        />

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

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={<Lock className="h-5 w-5" />}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-300">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}