import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/common/PasswordInput';

const Signup: React.FC = () => {
  const [step, setStep] = useState<'signup' | 'confirm'>('signup');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { signUp, confirmSignUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password.length < 8) newErrors.password = 'At least 8 characters with uppercase, lowercase and number';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name);
      setStep('confirm');
    } catch (error: any) {
      if (error.message === 'CONFIRMATION_REQUIRED') {
        setStep('confirm');
      } else {
        setErrors({ general: error.message || 'Failed to create account.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setErrors({ code: 'Please enter the verification code' }); return; }
    setIsLoading(true);
    try {
      await confirmSignUp(formData.email, code);
      setSuccess('Account confirmed! Signing you in...');
      await signIn(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setErrors({ code: error.message || 'Invalid code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#0A1128]/15 px-4 py-4 text-sm text-[#0A1128] focus:outline-none focus:border-[#7C3AED] transition-colors";
  const labelClass = "block text-[11px] uppercase tracking-widest font-semibold text-[#0A1128]/50 mb-2";

  if (step === 'confirm') {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-[#F9F8F6] text-[#0A1128]">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-3 block">Verification</span>
            <h1 className="text-4xl lg:text-5xl font-editorial tracking-tight mb-3">Check Your Mail</h1>
            <p className="text-[#0A1128]/50 text-sm font-light">
              We dispatched a verification code to <span className="text-[#0A1128] font-medium">{formData.email}</span>
            </p>
          </div>

          <div className="bg-white border border-[#0A1128]/10 p-8 lg:p-12 shadow-sm">
            {success && (
              <div className="border border-green-500/30 bg-green-50 p-4 mb-6">
                <p className="text-green-700 text-xs font-medium text-center">{success}</p>
              </div>
            )}
            <form onSubmit={handleConfirm} className="space-y-6">
              <div>
                <label className={labelClass}>Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value); setErrors({}); }}
                  maxLength={6}
                  className={`${inputClass} text-center text-3xl tracking-[0.3em] font-editorial`}
                  autoFocus
                />
                {errors.code && <p className="text-red-500 text-xs mt-1 font-light">{errors.code}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0A1128] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-medium py-4 text-[11px] uppercase tracking-widest transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify & Authorize'}
              </button>
            </form>

            <p className="text-center text-[#0A1128]/40 text-xs mt-8 font-light">
              Didn't receive the dispatch? Inspect your spam folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-[#F9F8F6] text-[#0A1128]">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-12">
          <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-3 block">Registration</span>
          <h1 className="text-4xl lg:text-5xl font-editorial tracking-tight mb-3">Establish Profile</h1>
          <p className="text-[#0A1128]/50 text-sm font-light italic">Begin curating your unique olfactory library</p>
        </div>

        <div className="bg-white border border-[#0A1128]/10 p-8 lg:p-12 shadow-sm">
          {errors.general && (
            <div className="border border-red-500/30 bg-red-50 p-4 mb-6">
              <p className="text-red-700 text-xs font-medium">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className={labelClass}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className={inputClass} 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-light">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className={inputClass} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-light">{errors.email}</p>}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                inputClassName={inputClass}
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-light">{errors.password}</p>}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                inputClassName={inputClass}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-light">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A1128] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-medium py-4 text-[11px] uppercase tracking-widest transition-colors mt-2"
            >
              {isLoading ? 'Establishing...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#0A1128]/50 text-xs mt-8 font-light">
            Already established?{' '}
            <Link to="/login" className="text-[#7C3AED] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;