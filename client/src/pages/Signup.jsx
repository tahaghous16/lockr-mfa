import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', formData);
      toast.success(response.data.message || 'Signup successful!');
      
      // Navigate to Setup2FA and pass necessary data
      navigate('/setup-2fa', { 
        state: { 
          email: response.data.email,
          qrCode: response.data.qrCode,
          setupKey: response.data.setupKey
        } 
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <User size={20} />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="glass-input w-full pl-11"
          />
        </div>
        
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
            className="glass-input w-full pl-10"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full mt-6"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
          {!loading && <ArrowRight size={20} />}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-medium hover:underline">
          Log in here
        </Link>
      </p>
    </>
  );
};

export default Signup;
