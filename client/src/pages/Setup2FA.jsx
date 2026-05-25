import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Copy, Check, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Setup2FA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRefs = useRef([]);

  // Get data from location state
  const { email, qrCode, setupKey } = location.state || {};

  // Protect route if accessed directly without signup state
  if (!email || !qrCode || !setupKey) {
    return <Navigate to="/signup" replace />;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(setupKey);
    setCopied(true);
    toast.success('Setup key copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow pasting full 6 digits
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      // Focus last non-empty input or end
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs.current[lastIndex].focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if not empty
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
      const response = await api.post('/auth/verify-2fa', { email, token });
      toast.success(response.data.message || '2FA Enabled Successfully');
      navigate('/login');
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
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Setup 2FA</h2>
      <p className="text-sm text-slate-500 text-center mb-6">
        Scan the QR code with Google Authenticator or Microsoft Authenticator app.
      </p>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
      </div>

      <div className="w-full mb-8">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Or enter manual setup key</p>
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-3">
          <code className="text-brand-600 font-mono text-sm flex-1 font-semibold tracking-wider">{setupKey}</code>
          <button 
            onClick={handleCopy}
            className="text-slate-400 hover:text-brand-600 transition-colors p-1"
            title="Copy key"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="w-full">
        <p className="text-sm font-medium text-slate-700 mb-3 text-center">Enter the 6-digit code from your app</p>
        <div className="flex justify-between gap-2 mb-6">
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
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Complete Setup'}
          {!loading && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Setup2FA;
