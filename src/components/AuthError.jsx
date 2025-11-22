import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function AuthError({ message }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-600">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}