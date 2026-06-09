// src/components/Pages/RoomManagement/RoomManagementPage.tsx
import { useState } from "react";
import { Plus, DoorClosed, UserPlus, Edit2, Trash2, Box, Eye } from "lucide-react";
import MasterSearch from "@/components/Atoms/Search/MasterSearch";
import MasterTable, { type TableColumn } from "@/components/Organisms/Table/MasterTable";
import MasterForm, { type FormField } from "@/components/Organisms/Form/MasterForm";
import { RoomStatus, type RoomStatusType, RoomType, type RoomTypeValue } from "@/constants/constants";
import { MOCK_ROOMS } from "@/constants/constants";
import Button from "@/components/Atoms/Button/Button";
import ConfirmModal from "@/components/Molecules/Modal/ConfirmModal";
import Room3DViewer from "@/components/Organisms/Room3DViewer/Room3DViewer";
import Room3dModel from "@/components/Organisms/Room3DViewer/Room3dModel";

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
    const [viewing3DRoom, setViewing3DRoom] = useState<RoomData | null>(null);
    const [viewMode, setViewMode] = useState<'real' | 'sketch'>('real');


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
        {
            header: "Phòng", cell: (room) =>
                <div className="flex gap-1.5">
                    <span className="font-extrabold text-layout-text text-base">
                        {room.roomNumber}
                    </span>

                    <button
                        onClick={() => {
                            setViewing3DRoom(room);
                            setViewMode('real');
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition-all w-max shadow-sm hover:shadow-md dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
                        title={`Xem mô hình 3D của phòng ${room.roomNumber}`}
                    >
                        <Box size={14} />
                        XEM 3D
                    </button>
                </div>
        },
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
        { name: "roomNumber", label: "Số Phòng", type: "text", placeholder: "Nhập tên phòng", column: 1, rules: { required: { value: true, message: "Vui lòng nhập tên phòng" }, minLength: { value: 3, message: "Tên phòng tối thiểu 3 ký tự" }, maxLength: { value: 5, message: "Tên phòng tối đa 5 ký tự" } } },
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

        <div className="w-full h-full  flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-card-title drop-shadow-sm">Quản Lý Phòng</h1>
                </div>
                <Button
                    onClick={handleOpenAddRoom}
                    variant="volumetric"
                >
                    <Plus size={20} /> Thêm Phòng
                </Button>
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
            {viewing3DRoom && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
                    <div className="bg-card-bg w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl border border-card-border relative flex flex-col">

                        {/* Header của Modal */}
                        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border bg-card-bg/50">
                            <div>
                                <h3 className="text-xl font-bold text-card-title">
                                    Không gian 3D - Phòng {viewing3DRoom.roomNumber}
                                </h3>
                                <p className="text-sm text-card-text">
                                    Dùng chuột để xoay và cuộn để zoom không gian
                                </p>
                            </div>

                            {/* TABS CHUYỂN ĐỔI CHẾ ĐỘ XEM CHUYÊN NGHIỆP */}
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit border border-card-border">
                                <button
                                    onClick={() => setViewMode('real')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        viewMode === 'real'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-card-text hover:text-layout-text'
                                    }`}
                                >
                                    <Eye size={14} />
                                    MÔ HÌNH THỰC TẾ
                                </button>
                                <button
                                    onClick={() => setViewMode('sketch')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        viewMode === 'sketch'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-card-text hover:text-layout-text'
                                    }`}
                                >
                                    <Box size={14} />
                                    MÔ HÌNH VẼ CODE
                                </button>
                            </div>

                            <button
                                onClick={() => setViewing3DRoom(null)}
                                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors font-bold absolute top-5 right-5 sm:static cursor-pointer"
                            >
                                X
                            </button>
                        </div>

                        {/* Nội dung vùng hiển thị 3D */}
                        <div className="p-4 bg-black/5 dark:bg-black/20 min-h-[450px] flex flex-col justify-center">
                            {viewMode === 'real' ? (
                                /* Chỉ hiển thị mô hình quét thực tế rộng rãi không bị che */
                                <Room3DViewer modelUrl={`/src/models/4_6_2026-transformed.glb`} roomData={viewing3DRoom} />
                            ) : (
                                /* Chỉ hiển thị mô hình canvas 4 bức tường thông minh tự vẽ bằng code */
                                <Room3dModel />
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}