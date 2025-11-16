// ============================================
// 4. components/dashboard/StatusBadge.tsx - NEW
// ============================================
import React from 'react';

interface StatusBadgeProps {
  status: string;
  config: Record<string, { label: string; color: string }>;
}

export function StatusBadge({ status, config }: StatusBadgeProps) {
  const statusInfo = config[status as keyof typeof config];
  if (!statusInfo) return <span className="text-gray-600">ไม่ทราบ</span>;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
}
