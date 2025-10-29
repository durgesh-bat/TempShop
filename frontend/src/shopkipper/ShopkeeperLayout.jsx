import React from "react";
import { Toaster } from 'react-hot-toast';

export default function ShopkeeperLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      {children}
    </div>
  );
}
