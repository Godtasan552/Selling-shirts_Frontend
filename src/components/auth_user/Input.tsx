"use client";
import React, { ChangeEvent } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-sm">{label}</label>
      <input
        {...props}
        className="border p-2 rounded-md"
      />
    </div>
  );
}
