"use client";

import { useRouter } from "next/navigation";

export default function GoogleSignIn() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google/redirect`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Sign in with Google</h1>

      <button
        onClick={handleGoogleLogin}
        className="btn btn-outline btn-primary w-full flex items-center gap-2"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
}
