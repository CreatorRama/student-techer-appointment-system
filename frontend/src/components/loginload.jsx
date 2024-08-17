import React from 'react';
import { createPortal } from 'react-dom';

export default function Loginload() {
  return createPortal(
    <div className="bg-blue-700 absolute top-0 opacity-30 w-full h-full flex items-center justify-center">
      <div className="spinner w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
    </div>, 
    document.getElementById('port')
  );
}
