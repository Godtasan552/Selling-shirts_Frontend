// components/dashboard/LoadingState.tsx
import { Loader } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">กำลังโหลด dashboard...</p>
      </div>
    </div>
  );
}