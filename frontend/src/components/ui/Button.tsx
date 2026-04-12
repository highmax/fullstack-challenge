'use client';

import { ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
