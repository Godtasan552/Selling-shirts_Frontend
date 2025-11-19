import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
