import React, { useState, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const VerifyLoginOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const { email } = location.state || {};

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs.current[lastIndex].focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join('');
    if (token.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-login-otp', { email, token });
      toast.success(response.data.message || 'Login successful');
      
      // Save token and user data to context and localStorage
      saveAuth(response.data.user, response.data.token);
      
      navigate('/home');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || 'Invalid OTP. Please try again.');
      } else {
        console.error('API Error:', error);
        toast.error('Network error: ' + error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-orange-100 text-orange-500 p-3 rounded-2xl mb-4 shadow-sm inline-flex">
        <ShieldAlert size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Two-Factor Authentication</h2>
      <p className="text-sm text-slate-500 text-center mb-8">
        Enter the 6-digit code from your authenticator app to verify your identity.
      </p>

      <div className="w-full">
        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="6"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 bg-white/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all shadow-sm"
            />
          ))}
        </div>

        <button 
          onClick={handleVerify} 
          disabled={loading || otp.join('').length !== 6}
          className="btn-primary w-full"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Identity'}
          {!loading && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default VerifyLoginOTP;
