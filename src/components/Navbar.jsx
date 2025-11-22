import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md transition-colors ${
        location.pathname === to
          ? 'bg-indigo-900 text-indigo-200'
          : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {location.pathname === '/chat' && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                className="mr-4 p-2 hover:bg-gray-800 rounded-lg text-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-gray-100">Jarvie</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NavLink to="/chat">Chat</NavLink>
                <div className="h-4 w-px bg-gray-700" />
                <Link
                  to="/profile"
                  className="p-2 text-gray-300 hover:text-gray-100 transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}