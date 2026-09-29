import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, KeyRound, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/common/PasswordInput';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { resetPassword, confirmResetPassword } = useAuth();
  const navigate = useNavigate();

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-colors";
  const labelClass = "block text-sm font-medium text-white/70 mb-1.5";

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErrors({ email: 'Email is required' }); return; }
    setIsLoading(true);
    try {
      await resetPassword(email);
      setStep('reset');
    } catch (error: any) {
      setErrors({ email: error.message || 'Failed to send reset code.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!code) newErrors.code = 'Verification code is required';
    if (newPassword.length < 8) newErrors.newPassword = 'At least 8 characters with uppercase, lowercase and number';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      await confirmResetPassword(email, code, newPassword);
      setSuccess('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setErrors({ code: error.message || 'Invalid code or password.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-500/20 border border-violet-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="h-8 w-8 text-violet-300" />
            </div>
            <h1 className="text-3xl font-bold text-white">Set new password</h1>
            <p className="text-white/50 mt-2 text-sm">
              Enter the code sent to <span className="text-violet-300">{email}</span>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            {success && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3 mb-5">
                <p className="text-green-300 text-sm text-center">{success}</p>
              </div>
            )}
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className={labelClass}>Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value); setErrors({}); }}
                  placeholder="6-digit code"
                  maxLength={6}
                  className={`${inputClass} text-center text-xl tracking-widest font-bold`}
                  autoFocus
                />
                {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code}</p>}
              </div>

              <div>
                <label className={labelClass}>New Password</label>
                <PasswordInput
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password"
                  inputClassName={inputClass}
                  leftIcon={<Lock className="h-4 w-4" />}
                  autoComplete="new-password"
                />
                {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className={labelClass}>Confirm New Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  inputClassName={inputClass}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-500/20 border border-violet-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-violet-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Forgot password?</h1>
          <p className="text-white/50 mt-2">We'll send a reset code to your email</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors({}); }}
                  placeholder="your@email.com"
                  className={`${inputClass} pl-10`}
                  autoFocus
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-violet-300 hover:text-violet-200 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
