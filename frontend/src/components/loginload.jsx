import React from 'react';
import { createPortal } from 'react-dom';

export default function Loginload() {
  return createPortal(
    <div className="fixed inset-0 bg-blue-700 opacity-30 z-50 flex items-center justify-center">
      <div className="spinner w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>, 
    document.body
  );
}