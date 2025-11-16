// pages/admin/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // เพื่อส่ง cookies
          body: JSON.stringify({ email, password }),
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // เก็บ tokens
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      // บันทึก admin info (optional)
      if (data.admin) {
        localStorage.setItem('admin', JSON.stringify(data.admin));
      }

      // Redirect ไปหน้า dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
        <meta name="description" content="Admin Panel Login" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                <p className="text-blue-100">Secure Login</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.261l1.414 1.414a2 2 0 112.828 2.829l-1.414-1.415a4 4 0 00-2.828-2.828zM12 10a2 2 0 11-4 0 2 2 0 014 0zm3.879-7.879l-1.415 1.415a10.037 10.037 0 012.670 3.282 1 1 0 001.8-.6 11.947 11.947 0 00-3.054-3.904zM5.009 5.009a1 1 0 001.418-1.406 10.017 10.017 0 0112.584 12.584 1 1 0 11-1.406 1.418 8.017 8.017 0 01-10.596-10.596z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Admin access only
                </p>
              </div>
            </form>
          </div>

          {/* Demo Info */}
          <div className="mt-6 text-center text-sm text-gray-300">
            <p>Protected Admin Login System</p>
          </div>
        </div>
      </div>
    </>
  );
}