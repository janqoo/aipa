import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/common/PasswordInput';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setErrors({ general: error.message || 'Invalid email or password.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#0A1128]/15 px-4 py-4 text-sm text-[#0A1128] focus:outline-none focus:border-[#7C3AED] transition-colors";
  const labelClass = "block text-[11px] uppercase tracking-widest font-semibold text-[#0A1128]/50 mb-2";

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-[#F9F8F6] text-[#0A1128]">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-12">
          <span className="text-[#7C3AED] text-[11px] uppercase tracking-[0.2em] font-medium mb-3 block">Authentication</span>
          <h1 className="text-4xl lg:text-5xl font-editorial tracking-tight mb-3">Welcome Back</h1>
          <p className="text-[#0A1128]/50 text-sm font-light italic">Access your private archive and formulations</p>
        </div>

        <div className="bg-white border border-[#0A1128]/10 p-8 lg:p-12 shadow-sm">
          {errors.general && (
            <div className="border border-red-500/30 bg-red-50 p-4 mb-6">
              <p className="text-red-700 text-xs font-medium">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className={inputClass} 
                autoFocus 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-light">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass} style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" className="text-[11px] uppercase tracking-widest text-[#0A1128]/50 hover:text-[#7C3AED] transition-colors">
                  Recovery?
                </Link>
              </div>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                inputClassName={inputClass}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-light">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A1128] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-medium py-4 text-[11px] uppercase tracking-widest transition-colors mt-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#0A1128]/50 text-xs mt-8 font-light">
            No profile established?{' '}
            <Link to="/signup" className="text-[#7C3AED] font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;