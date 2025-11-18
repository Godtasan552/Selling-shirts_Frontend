// ============================================
// 7. components/dashboard/shared/StatCard.tsx
// ============================================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: { value: number; isPositive: boolean };
}

export function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}% vs last month
            </p>
          )}
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}