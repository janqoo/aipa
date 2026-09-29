import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputClassName: string;
  leftIcon?: React.ReactNode;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  inputClassName,
  leftIcon,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          {leftIcon}
        </span>
      )}
      <input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={`${inputClassName} ${leftIcon ? 'pl-10' : ''} pr-12 ${className}`}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-white/45 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400/60"
        aria-label={isVisible ? 'Hide password' : 'Show password'}
      >
        {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
