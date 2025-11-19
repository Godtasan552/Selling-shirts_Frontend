// ============================================
// 2. utils/statusHelpers.ts - NEW
// ============================================
export const orderStatusConfig = {
  pending_payment: { label: 'รอชำระเงิน', color: 'bg-blue-100 text-blue-800' },
  verifying_payment: { label: 'รอตรวจสอบ', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'ชำระแล้ว', color: 'bg-green-100 text-green-800' },
  shipping: { label: 'จัดส่งแล้ว', color: 'bg-indigo-100 text-indigo-800' },
  completed: { label: 'สำเร็จ', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-800' },
} as const;

export const roleConfig = {
  admin: { label: 'แอดมิน', color: 'bg-red-100 text-red-800' },
  staff: { label: 'พนักงาน', color: 'bg-purple-100 text-purple-800' },
} as const;

export const productStatusConfig = {
  active: { label: 'เปิดใช้งาน', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'ปิดใช้งาน', color: 'bg-gray-100 text-gray-800' },
  discontinued: { label: 'หยุดจำหน่าย', color: 'bg-red-100 text-red-800' },
} as const;
