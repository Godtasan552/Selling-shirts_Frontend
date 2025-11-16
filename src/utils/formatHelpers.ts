// ============================================
// 3. utils/formatHelpers.ts - NEW
// ============================================
export const formatCurrency = (amount: number, locale = 'th-TH'): string => {
  return amount.toLocaleString(locale, { maximumFractionDigits: 0 });
};

export const formatDate = (date: string | Date, locale = 'th-TH'): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getTotalItems = (items: { quantity: number }[]): number => {
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

export const getUserDisplayName = (user: { name?: string; phone?: string; email?: string }): string => {
  return user.name || user.phone || user.email || 'ไม่มีชื่อ';
};

export const getProviderType = (user: { phone?: string; googleId?: string }): string => {
  if (user.phone && user.googleId) return 'Phone + Google';
  if (user.googleId) return 'Google';
  if (user.phone) return 'Phone';
  return 'Unknown';
};