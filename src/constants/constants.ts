export const RoomStatus = {
  Available: 0,
  Rented: 1,
  Maintenance: 2,
} as const;

export type RoomStatusType = typeof RoomStatus[keyof typeof RoomStatus];

export const RoomType = {
  Standard: 0,
  VIP: 1,
} as const;

export type RoomTypeValue = typeof RoomType[keyof typeof RoomType];


export const MOCK_SERVICES = [
  { id: "1", name: "Điện", type: "electricity", price: 3500, unit: "kWh", isTiered: true },
  { id: "2", name: "Nước", type: "water", price: 15000, unit: "m³", isTiered: false },
  { id: "3", name: "Internet", type: "internet", price: 100000, unit: "tháng", isTiered: false },
  { id: "4", name: "Rác", type: "trash", price: 20000, unit: "tháng", isTiered: false },
];

export const InvoiceStatus = {
  Pending: 0,
  Paid: 1,
  Overdue: 2,
} as const;

export type InvoiceStatusType = typeof InvoiceStatus[keyof typeof InvoiceStatus];

export const MOCK_INVOICES = [
  { id: "INV-2605001", roomNumber: "201", tenantName: "Nguyen Van A", amount: 5850000, issueDate: "2026-05-01", status: InvoiceStatus.Paid },
  { id: "INV-2605002", roomNumber: "101", tenantName: "Tran Thi B", amount: 4250000, issueDate: "2026-05-01", status: InvoiceStatus.Paid },
  { id: "INV-2605003", roomNumber: "102", tenantName: "Le Van C", amount: 3800000, issueDate: "2026-05-15", status: InvoiceStatus.Pending },
  { id: "INV-2605004", roomNumber: "301", tenantName: "Pham Minh D", amount: 6200000, issueDate: "2026-05-15", status: InvoiceStatus.Pending },
  { id: "INV-2605005", roomNumber: "104", tenantName: "Hoang Van E", amount: 4000000, issueDate: "2026-04-01", status: InvoiceStatus.Overdue },
  { id: "INV-2605006", roomNumber: "203", tenantName: "Do Thi F", amount: 4500000, issueDate: "2026-04-01", status: InvoiceStatus.Overdue },
];

export const MOCK_ROOMS = [
    { id: "1", roomNumber: 101, tenantName: "Nguyen Van A", avatarColor: "bg-purple-500", price: 3500000, phone: "0901 234 567", status: RoomStatus.Rented, typeRoom: RoomType.Standard, description: "Phòng có ban công, view đẹp" },
    { id: "2", roomNumber: 102, tenantName: null, price: 3500000, phone: null, status: RoomStatus.Available, typeRoom: RoomType.Standard, description: "Phòng rộng rãi, có cửa sổ lớn" },
    { id: "3", roomNumber: 103, tenantName: "Tran Thi B", avatarColor: "bg-purple-500", price: 4000000, phone: "0912 345 678", status: RoomStatus.Rented, typeRoom: RoomType.VIP, description: "Phòng cao cấp, nội thất hiện đại" },
    { id: "4", roomNumber: 104, tenantName: null, price: 4000000, phone: null, status: RoomStatus.Maintenance, typeRoom: RoomType.Standard, description: "Phòng đang bảo trì" },
    { id: "5", roomNumber: 201, tenantName: "Le Van C", avatarColor: "bg-purple-500", price: 5000000, phone: "0923 456 789", status: RoomStatus.Maintenance, typeRoom: RoomType.VIP, description: "Phòng VIP, có hồ bơi" },
    { id: "6", roomNumber: 202, tenantName: null, avatarColor: "bg-purple-500", price: 5000000, phone: null, status: RoomStatus.Available, typeRoom: RoomType.Standard, description: "Phòng tiêu chuẩn, tiện nghi đầy đủ" },
];
