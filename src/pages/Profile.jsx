import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import FormInput from '../components/FormInput';
import AuthError from '../components/AuthError';
import { validatePassword, validateConfirmPassword } from '../utils/validation';

export default function Profile() {
  const { profile, isLoading, error: profileError, changePassword } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validatePasswordForm = () => {
    const newPasswordError = validatePassword(passwordForm.newPassword);
    const confirmError = validateConfirmPassword(
      passwordForm.confirmPassword,
      { password: passwordForm.newPassword }
    );

    if (newPasswordError || confirmError) {
      setError(newPasswordError || confirmError);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm() || isUpdating) return;

    setIsUpdating(true);
    setError('');
    setSuccess('');

    try {
      await changePassword(passwordForm.newPassword, passwordForm.confirmPassword);
      setSuccess('Password updated successfully');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Profile Settings</h2>

        {profileError && <AuthError message={profileError} />}

        <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg mb-6">
          <div className="h-20 w-20 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100">{profile?.name}</h3>
            <p className="text-gray-300">{profile?.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Change Password</h3>
          
          {error && <AuthError message={error} />}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-500 text-sm mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              disabled={isUpdating}
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
              labelClassName="text-gray-300"
            />

            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              disabled={isUpdating}
              className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
              labelClassName="text-gray-300"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}