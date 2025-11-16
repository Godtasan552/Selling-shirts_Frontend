// components/dashboard/UserTable.tsx
import { User } from '@/hooks/useDashboard';

export function UserTable({ users }: { users: User[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ผู้ใช้ล่าสุด</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">ชื่อ</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">อีเมล</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">บทบาท</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.phone || 'ไม่มีชื่อ'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs break-all">{user.email || '-'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'staff'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role === 'admin' && 'แอดมิน'}
                      {user.role === 'staff' && 'พนักงาน'}
                      {!['admin', 'staff'].includes(user.role || '') && 'ผู้ใช้'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-gray-600">
                  ไม่พบผู้ใช้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}