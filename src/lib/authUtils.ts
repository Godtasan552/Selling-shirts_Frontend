// lib/authUtils.ts
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

export const getAdminUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const admin = localStorage.getItem('admin');
  return admin ? JSON.parse(admin) : null;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const setAdminUser = (admin: AdminUser) => {
  localStorage.setItem('admin', JSON.stringify(admin));
};

export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('admin');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};