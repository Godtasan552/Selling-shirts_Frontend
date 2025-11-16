// components/dashboard/ErrorState.tsx
import { AlertCircle } from 'lucide-react';

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-700">ข้อผิดพลาด: {error}</p>
      </div>
    </div>
  );
}