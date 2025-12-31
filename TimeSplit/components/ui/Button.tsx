import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ className = '', children, variant = 'primary', ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-black uppercase tracking-wide transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] active:translate-y-[4px] active:border-b-0";
  
  const variants = {
    primary: "bg-[#4CAF50] hover:bg-[#43A047] text-white border-b-[6px] border-[#2E7D32] shadow-xl hover:shadow-2xl",
    secondary: "bg-white text-gray-800 border-2 border-gray-200 border-b-[6px] border-b-gray-300 hover:bg-gray-50",
    danger: "bg-[#FF6B35] hover:bg-[#F4511E] text-white border-b-[6px] border-[#BF360C] shadow-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} shine-effect`}
      {...props}
    >
      {children}
    </button>
  );
};