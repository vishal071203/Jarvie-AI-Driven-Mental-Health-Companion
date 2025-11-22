import React from 'react';

export default function FormInput({ 
  label, 
  error, 
  icon, 
  className = '', 
  labelClassName = '',
  ...props 
}) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${labelClassName}`}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`${icon ? 'pl-10' : 'px-4'} w-full py-2 rounded-md shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 
            ${error ? 'border-red-500' : ''} 
            ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}