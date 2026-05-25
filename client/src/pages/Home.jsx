import React, { useEffect, useState } from 'react';
import { LogOut, User as UserIcon, Mail, Shield, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/home');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHomeData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-accent-500/10 blur-[100px] pointer-events-none" />

      {/* Header (Fixed Navbar) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-brand-100 text-brand-600 p-2 rounded-xl shadow-sm">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lockr</h1>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-sm font-medium border border-slate-200"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content with top padding to account for fixed header */}
      <div className="max-w-4xl mx-auto relative z-10 p-6 pt-32">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Welcome back, <span className="text-brand-600">{user?.username || 'User'}</span>! 👋
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            {dashboardData?.message || 'You have successfully authenticated with 2FA.'}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-full text-slate-500">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Username</p>
                  <p className="font-medium text-slate-800">{user?.username || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-full text-slate-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="font-medium text-slate-800">{user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-brand-500 to-accent-500 text-white border-none shadow-brand-500/20">
            <h3 className="text-sm font-semibold text-brand-100 uppercase tracking-wider mb-4 border-b border-white/20 pb-2">Security Status</h3>
            <div className="flex flex-col h-full justify-center pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Shield size={24} className="text-white" />
                </div>
                <h4 className="text-xl font-bold">2FA Enabled</h4>
              </div>
              <p className="text-brand-100 text-sm">
                Your account is secure. Two-factor authentication is active and protecting your data.
              </p>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-slate-500 pb-6">
          <p>Created by Taha Ghous</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
