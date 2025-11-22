import React from 'react';
import { Settings, HelpCircle, LogOut, X } from 'lucide-react';

export default function ChatSidebar({ isOpen, onClose, onLogout, onNavigate }) {
  const SidebarLink = ({ icon: Icon, text, onClick }) => (
    <button 
      onClick={() => isOpen && onClick()}
      className={`w-full flex items-center ${isOpen ? 'px-4 cursor-pointer' : 'justify-center cursor-default'} py-3 text-gray-400 ${isOpen ? 'hover:bg-gray-700 hover:text-gray-200' : ''} rounded-lg transition-colors`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isOpen && <span className="ml-2">{text}</span>}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`
          md:relative fixed 
          ${isOpen ? 'w-64' : 'w-16'} 
          md:flex md:flex-col
          bg-gray-800 shadow-lg transition-all duration-300 ease-in-out z-30 h-full
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        `}
      >
        <div className="p-2">
          {isOpen && (
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-semibold text-gray-200">Menu</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-200 md:hidden"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          <div className="space-y-1">
            <SidebarLink 
              icon={Settings} 
              text="Settings" 
              onClick={() => onNavigate('/profile')} 
            />
            <SidebarLink 
              icon={HelpCircle} 
              text="Help & FAQ" 
              onClick={() => {}} 
            />
            <SidebarLink 
              icon={LogOut} 
              text="Logout" 
              onClick={onLogout} 
            />
          </div>
        </div>
      </div>
    </>
  );
}