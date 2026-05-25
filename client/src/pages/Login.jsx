import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.requires2FA) {
        toast.success(response.data.message || 'Enter OTP');
        navigate('/verify-login-otp', { state: { email: formData.email } });
      } else {
        // If no 2FA is required (fallback scenario)
        toast.success('Login successful');
        // Note: Backend might not return token/user in login if 2FA is off based on current code, 
        // but if it did we'd call saveAuth here. Assuming 2FA is mandatory based on flow.
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Welcome Back</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail size={20} />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="glass-input w-full pl-11"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock size={20} />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="glass-input w-full pl-11"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-6"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
          {!loading && <ArrowRight size={20} />}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-600 font-medium hover:underline">
          Sign up here
        </Link>
      </p>
    </>
  );
};

export default Login;
