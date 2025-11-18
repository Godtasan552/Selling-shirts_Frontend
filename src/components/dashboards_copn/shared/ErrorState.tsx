// ============================================
// 6. components/dashboard/shared/ErrorState.tsx
// ============================================
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">ข้อผิดพลาด: {error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
          >
            ลองใหม่
          </button>
        )}
      </div>
    </div>
  );
}