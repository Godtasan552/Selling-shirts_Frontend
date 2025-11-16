// components/dashboard/AdminTable.tsx
import type { AdminUser } from '@/hooks/useDashboard';

export function AdminTable({ admins }: { admins: AdminUser[] }) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'staff':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'แอดมิน';
      case 'staff':
        return 'พนักงาน';
      default:
        return 'ไม่ระบุ';
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        เปิดใช้งาน
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        ปิดใช้งาน
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        ผู้ดูแลระบบ ({admins.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">ชื่อ</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">บทบาท</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {admin.username}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                      {getRoleLabel(admin.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(admin.isActive)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center text-gray-600">
                  ไม่พบผู้ดูแลระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}