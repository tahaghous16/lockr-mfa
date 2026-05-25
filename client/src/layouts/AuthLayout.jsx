import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const AuthLayout = () => {
  const { token } = useAuth();

  // If user is already logged in, redirect to home
  if (token) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/20 blur-[100px]" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-brand-100 text-brand-600 p-3 rounded-2xl mb-4 shadow-sm inline-flex">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Lockr</h1>
          <p className="text-slate-500 mt-1">Multi-Factor Authentication</p>
        </div>
        
        <div className="glass-card p-8">
          <Outlet />
        </div>
        
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>Created by Taha Ghous</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
