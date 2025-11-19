// components/dashboards/UserTable.tsx
import { User } from '@/hooks/useDashboard';

export function UserTable({ users }: { users: User[] }) {
  // Helper function เพื่อดึงชื่อ
  const getUserDisplayName = (user: User): string => {
    if (user.name) return user.name;
    if (user.phone) return user.phone;
    if (user.email) return user.email;
    return 'ไม่มีชื่อ';
  };

  // Helper function เพื่อระบุประเภท provider
  const getProviderType = (user: User): string => {
    if (user.phone && user.googleId) return 'Phone + Google';
    if (user.googleId) return 'Google';
    if (user.phone) return 'Phone';
    return 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ผู้ใช้ล่าสุด</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">ชื่อ</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">อีเมล/เบอร์</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">ประเภท</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {getUserDisplayName(user)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs break-all">
                    {user.email || user.phone || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.googleId && user.phone
                          ? 'bg-violet-100 text-violet-800'
                          : user.googleId
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {getProviderType(user)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.verified ? '✓ ยืนยัน' : '⏳ รอยืนยัน'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center text-gray-600">
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