"use client";
import React from "react";

export default function Input({ label, type, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border p-2 rounded-md"
      />
    </div>
  );
}
