// src/components/Pages/RoomManagement/RoomManagementPage.tsx
import { useState } from "react";
import { Plus, DoorClosed, UserPlus, Edit2, Trash2 } from "lucide-react";
import MasterSearch from "@/components/Atoms/Search/MasterSearch";
import MasterTable, { type TableColumn } from "@/components/Organisms/Table/MasterTable";
import MasterForm, { type FormField } from "@/components/Organisms/Form/MasterForm";
import { RoomStatus, type RoomStatusType, RoomType, type RoomTypeValue } from "@/constants/constants";
import { MOCK_ROOMS } from "@/constants/constants";
import ConfirmModal from "@/components/Molecules/Modal/ConfirmModal";

interface RoomData {
    id: string;
    roomNumber: number;
    tenantName: string | null;
    price: number;
    phone: string | null;
    status: RoomStatusType;
    avatarLetter?: string;
    avatarColor?: string;
    typeRoom: RoomTypeValue;
    description?: string;
}

interface AddRoomFormData {
    roomNumber: number;
    floor: number;
    basePrice: number;
    description?: string;
    typeRoom: RoomTypeValue;
    status: RoomStatusType;
}

interface AddTenantFormData {
    fullName: string;
    phone: string;
    identityCard: string;
    depositAmount: number;
    startDate: string;
}

const filterState = [
    { label: "Tất cả", value: "All" },
    { label: "Có sẵn", value: RoomStatus.Available },
    { label: "Đã cho thuê", value: RoomStatus.Rented },
    { label: "Bảo trì", value: RoomStatus.Maintenance }
];

const typeRoomState = [
    { label: "Standard", value: RoomType.Standard },
    { label: "VIP", value: RoomType.VIP }
];

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState<RoomData[]>(MOCK_ROOMS);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<RoomStatusType | string>("All");

    const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
    const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);


    const filteredRooms = rooms.filter(room => {
        const matchesFilter = activeFilter === "All" || room.status === activeFilter;
        const matchesSearch = room.roomNumber.toString().includes(searchQuery) ||
            (room.tenantName && room.tenantName.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const handleOpenAddRoom = () => {
        setSelectedRoom(null);
        setIsRoomFormOpen(true);
    };

    const handleOpenEditRoom = (room: RoomData) => {
        console.log("dây", room);
        setSelectedRoom(room);
        setIsRoomFormOpen(true);
    };

    const handleOpenAddTenant = (room: RoomData) => {
        setSelectedRoom(room);
        setIsAddTenantOpen(true);
    };

        const isEditMode = !!selectedRoom;
    const roomDefaultValues = selectedRoom ? {
        roomNumber: selectedRoom.roomNumber,
        basePrice: selectedRoom.price,
        typeRoom: selectedRoom.typeRoom,
        status: selectedRoom.status,
        description: selectedRoom.description
    } : undefined;

    const handleRoomSubmit = (data: AddRoomFormData) => {
        if (selectedRoom) {
            setRooms(prevRooms => prevRooms.map(room =>
                room.id === selectedRoom.id
                    ? { ...room, roomNumber: data.roomNumber, price: data.basePrice, description: data.description, status: data.status }
                    : room
            ));
        } else {
            const newRoom: RoomData = {
                id: Date.now().toString(),
                roomNumber: data.roomNumber,
                price: data.basePrice,
                tenantName: null,
                phone: null,
                status: data.status,
                typeRoom: RoomType.Standard,
                description: data.description
            };
            setRooms(prevRooms => [newRoom, ...prevRooms]);
        }
        setIsRoomFormOpen(false);
        setSelectedRoom(null);
    };

    const handleAddTenantSubmit = (data: AddTenantFormData) => {
        if (selectedRoom) {
            setRooms(prevRooms => prevRooms.map(room =>
                room.id === selectedRoom.id
                    ? {
                        ...room,
                        tenantName: data.fullName,
                        phone: data.phone,
                        status: RoomStatus.Rented,
                        avatarColor: "bg-blue-500"
                    }
                    : room
            ));
        }
        setIsAddTenantOpen(false);
        setSelectedRoom(null);
    };
    



    const handleDeleteRoom = () => {
        if (!selectedRoom) return;
        

        setRooms(prevRooms => prevRooms.filter(r => r.id !== selectedRoom.id));
        

        setIsDeleteConfirmOpen(false);
        setSelectedRoom(null);
    };

    const roomColumns: TableColumn<RoomData>[] = [
        { header: "Phòng", cell: (room) => <span className="font-bold text-blue-600 dark:text-blue-400">{room.roomNumber}</span> },
        { header: "Nguời thuê", cell: (room) => room.tenantName ? <span className="font-semibold text-layout-text">{room.tenantName}</span> : <span className="text-card-text">—</span> },
        { header: "Giá / Tháng", align: "center", cell: (room) => <span className="font-semibold text-blue-600 dark:text-blue-400">{new Intl.NumberFormat("vi-VN").format(room.price)} VND</span> },
        {
            header: "SĐT",
            align: "center",
            cell: (room) => <span className="font-medium text-card-text">{room.phone || "—"}</span>
        },
        {
            header: "Trạng Thái",
            align: "center",
            cell: (room) => {
                const statusLabel = filterState.find(state => state.value === room.status)?.label || "chưa có thông tin";
                const badgeStyles: Record<RoomStatusType, string> = {
                    [RoomStatus.Available]: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
                    [RoomStatus.Rented]: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
                    [RoomStatus.Maintenance]: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
                };
                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all duration-300
          ${badgeStyles[room.status] || "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}
                    >
                        {statusLabel}
                    </span>
                );
            }
        },
        {
            header: "Loại Phòng",
            align: "center",
            cell: (room) => {
                const typeLabel = typeRoomState.find(type => type.value === room.typeRoom)?.label || "Unknown";
                return <span className="font-medium text-card-text">{typeLabel}</span>;
            }
        },
        {
            header: "Thao tác",
            align: "right",
            cell: (room) => (
                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {room.status === RoomStatus.Available && (
                        <button onClick={() => handleOpenAddTenant(room)} className="flex items-center gap-1 bg-btn-solid hover:bg-btn-solid-hover text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                            <Plus size={14} /> Thêm Khách
                        </button>
                    )}
                    <button onClick={() => handleOpenEditRoom(room)} className="p-2 bg-card-icon-bg border border-card-icon-border text-card-text hover:text-blue-500 rounded-xl transition-all hover:bg-white dark:hover:bg-gray-800 cursor-pointer">
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedRoom(room);
                            setIsDeleteConfirmOpen(true);
                        }} 
                        className="p-2 bg-card-icon-bg border border-card-icon-border text-card-text hover:text-red-500 rounded-xl transition-all hover:bg-white dark:hover:bg-gray-800 cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const addRoomFields: FormField<AddRoomFormData>[] = [
        { name: "roomNumber", label: "Số Phòng", type: "text", placeholder: "Nhập tên phòng", column: 1, rules: { required: { value: true, message: "Vui lòng nhập tên phòng" }, minLength: { value: 3, message: "Tên phòng tối thiểu 3 ký tự" }, maxLength: {value: 5, message: "Tên phòng tối đa 5 ký tự"} } },
        { name: "status", label: "Trạng Thái", type: "select", options: isEditMode ? filterState.filter((state) => state.value !== "All") : filterState.filter((state) => state.value === RoomStatus.Maintenance || state.value === RoomStatus.Available), placeholder: "Chọn trạng thái", column: 1, rules: { required: { value: true, message: "Vui lòng chọn trạng thái" } } },
        { name: "basePrice", label: "Giá Phòng (Tháng)", type: "number", placeholder: "Nhập giá phòng", hideSpin: true, unit: "VND", column: 1, rules: { required: { value: true, message: "Vui lòng nhập giá phòng" }, min: { value: 100000, message: "Giá quá thấp" }, max: { value: 100000000, message: "Giá quá cao" } } },
        { name: "typeRoom", label: "Loại Phòng", type: "select", options: typeRoomState, placeholder: "Chọn loại phòng", column: 1, rules: { required: { value: true, message: "Vui lòng chọn loại phòng" } } },
        { name: "description", label: "Mô Tả", type: "textarea", placeholder: "Nhập mô tả", column: 2 },
    ];

    const addTenantFields: FormField<AddTenantFormData>[] = [
        { name: "fullName", label: "Họ và tên", type: "text", placeholder: "Họ và tên", column: 2, rules: { required: { value: true, message: "Vui lòng nhập họ tên" } } },
        { name: "phone", label: "SĐT", type: "text", placeholder: "SĐT", column: 1, rules: { required: { value: true, message: "Vui lòng nhập SĐT" }, pattern: { value: /^[0-9]{10,11}$/, message: "SĐT không hợp lệ" } } },
        { name: "identityCard", label: "CCCD", type: "text", placeholder: "CCCD", column: 1, rules: { required: { value: true, message: "Vui lòng nhập CCCD" }, minLength: { value: 9, message: "CCCD tối thiểu 9 số" } } },
        { name: "depositAmount", label: "Tiền cọc", type: "number", placeholder: "Số tài khoản", unit: "VND", column: 1, rules: { required: { value: true, message: "Vui lòng nhập tiền cọc" }, min: { value: 0, message: "Không được âm" } } },
        { name: "startDate", label: "Ngày bắt đầu", type: "date", column: 1, rules: { required: { value: true, message: "Vui lòng chọn ngày" } } }
    ];

    return (
        
        <div className="w-full h-full flex flex-col gap-6 pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-card-title drop-shadow-sm">Quản Lý Phòng</h1>
                </div>
                <button
                    onClick={handleOpenAddRoom}
                    className="flex items-center gap-2 bg-btn-solid hover:bg-btn-solid-hover text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                    <Plus size={20} /> Thêm Phòng
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 p-2 bg-card-bg backdrop-blur-xl border border-card-border rounded-[20px] shadow-sm">
                <MasterSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder="Tìm kiếm theo số phòng hoặc tên khách thuê"
                />
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 liquid-scrollbar">
                    {filterState.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${activeFilter === filter.value
                                ? "bg-btn-solid text-white shadow-md"
                                : "bg-btn-glass-bg text-card-text border border-transparent hover:border-btn-glass-border hover:text-layout-text"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            <MasterTable
                data={filteredRooms}
                columns={roomColumns}
                emptyMessage="Không có dữ liệu"
            />

            <MasterForm
                isOpen={isRoomFormOpen}
                onClose={() => {
                    setIsRoomFormOpen(false);
                    setSelectedRoom(null);
                }}
                title={isEditMode ? `Cập nhật phòng ${selectedRoom.roomNumber}` : "Thêm Phòng Mới"}
                subtitle={isEditMode ? "Cập nhật thông tin của phòng này." : "Nhập thông tin để tạo phòng mới."}
                icon={isEditMode ? <Edit2 size={28} /> : <DoorClosed size={28} />}
                iconBgClass={isEditMode ? "bg-amber-500" : "bg-blue-500"}
                fields={addRoomFields}
                defaultValues={roomDefaultValues}
                onSubmit={handleRoomSubmit}
                submitText={isEditMode ? "Lưu Thay Đổi" : "Thêm Phòng"}
            />

            <MasterForm
                isOpen={isAddTenantOpen}
                onClose={() => {
                    setIsAddTenantOpen(false);
                    setSelectedRoom(null);
                }}
                title="Thêm Khách Thuê"
                subtitle={`Nhập thông tin khách thuê cho phòng ${selectedRoom?.roomNumber || ""}.`}
                icon={<UserPlus size={28} />}
                iconBgClass="bg-emerald-500"
                fields={addTenantFields}
                onSubmit={handleAddTenantSubmit}
                submitText="Xác Nhận"
            />
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setSelectedRoom(null);
                }}
                onConfirm={handleDeleteRoom} 
                title="Xóa Phòng"
                message={`Bạn có chắc chắn muốn xóa phòng ${selectedRoom?.roomNumber || ""} không?`}
                confirmText="Xóa Phòng"
                cancelText="Hủy Bỏ"
                variant="danger"
            />
        </div>
    );
}