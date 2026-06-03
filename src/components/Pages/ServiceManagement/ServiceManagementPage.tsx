// src/components/Pages/ServiceManagement/ServiceManagementPage.tsx
import { useState } from "react";
import { Plus, Edit2, Trash2, Zap, Droplet, Wifi, Trash, Settings, AlertTriangle } from "lucide-react";
import MasterSearch from "@/components/Atoms/Search/MasterSearch";
import MasterTable, { type TableColumn } from "@/components/Organisms/Table/MasterTable";
import MasterForm, { type FormField } from "@/components/Organisms/Form/MasterForm";
import ConfirmModal from "@/components/Molecules/Modal/ConfirmModal";
import { MOCK_SERVICES } from "../../../constants/constants";

interface ServiceData {
  id: string;
  name: string;
  type: "electricity" | "water" | "internet" | "trash" | "other";
  price: number;
  unit: string;
  isTiered?: boolean;
}


interface ServiceFormData {
  name: string;
  type: "electricity" | "water" | "internet" | "trash" | "other";
  price: number;
  unit: string;
}

export default function ServiceManagementPage() {
  const [services, setServices] = useState<ServiceData[]>(MOCK_SERVICES as ServiceData[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  const isEditMode = !!selectedService;

  const getServiceIconConfig = (type: string) => {
    const map = {
      electricity: { icon: <Zap size={18} />, bg: "bg-service-electricity-bg text-service-electricity-text border-service-electricity-border" },
      water: { icon: <Droplet size={18} />, bg: "bg-service-water-bg text-service-water-text border-service-water-border" },
      internet: { icon: <Wifi size={18} />, bg: "bg-service-internet-bg text-service-internet-text border-service-internet-border" },
      trash: { icon: <Trash size={18} />, bg: "bg-service-trash-bg text-service-trash-text border-service-trash-border" },
      other: { icon: <Settings size={18} />, bg: "bg-service-other-bg text-service-other-text border-service-other-border" },
    };
    return map[type as keyof typeof map] || map.other;
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleOpenAddService = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleOpenEditService = (service: ServiceData) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: ServiceFormData) => {
    if (selectedService) {

      setServices((prev) =>
        prev.map((s) => (s.id === selectedService.id ? { ...s, ...data } : s))
      );
    } else {
      const newService: ServiceData = {
        id: Date.now().toString(),
        ...data,
        isTiered: data.type === "electricity",
      };
      setServices((prev) => [...prev, newService]);
    }
    setIsFormOpen(false);
    setSelectedService(null);
  };

  const handleDeleteService = () => {
    if (!selectedService) return;
    setServices((prev) => prev.filter((s) => s.id !== selectedService.id));
    setIsDeleteConfirmOpen(false);
    setSelectedService(null);
  };

  const columns: TableColumn<ServiceData>[] = [
    {
      header: "Tên Dịch Vụ",
      cell: (service) => {
        const cfg = getServiceIconConfig(service.type);
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border backdrop-blur-md ${cfg.bg}`}>
              {cfg.icon}
            </div>
            <span className="font-bold text-layout-text">{service.name}</span>
          </div>
        );
      },
    },
    {
      header: "Loại Dịch Vụ",
      cell: (service) => (
        <span className="font-medium text-card-text uppercase tracking-wider text-xs">
          {service.type === "electricity" ? "Điện" : service.type === "water" ? "Nước" : "Dịch vụ khác"}
        </span>
      ),
    },
    {
      header: "Đơn Giá (VND)",
      cell: (service) => (
        <span className="font-medium text-blue-600 dark:text-blue-400">
          {new Intl.NumberFormat("vi-VN").format(service.price)} VND
          {service.isTiered && <span className="text-xs font-medium text-amber-500 ml-1">(Bậc thang)</span>}
        </span>
      ),
    },
    {
      header: "Đơn Vị",
      cell: (service) => <span className="font-semibold text-card-text">mỗi {service.unit}</span>,
    },
    {
      header: "Thao tác",
      align: "right",
      cell: (service) => (
        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleOpenEditService(service)}
            className="p-2 bg-card-icon-bg border border-card-icon-border text-card-text hover:text-blue-500 rounded-xl transition-all hover:bg-white dark:hover:bg-gray-800 cursor-pointer"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedService(service);
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

  const formFields: FormField<ServiceFormData>[] = [
    {
      name: "name",
      label: "Tên Dịch Vụ",
      type: "text",
      placeholder: "Ví dụ: Tiền mạng mạng Wifi, Vệ sinh nhà",
      column: 2,
      rules: { required: { value: true, message: "Vui lòng nhập tên dịch vụ" } },
    },
    {
      name: "type",
      label: "Loại Hình",
      type: "select",
      placeholder: "Chọn loại hình dịch vụ",
      column: 1,
      options: [
        { label: "Điện", value: "electricity" },
        { label: "Nước", value: "water" },
        { label: "Internet", value: "internet" },
        { label: "Rác công cộng", value: "trash" },
        { label: "Khác", value: "other" },
      ],
      rules: { required: { value: true, message: "Vui lòng chọn loại hình" } },
    },
    {
      name: "unit",
      label: "Đơn vị tính",
      type: "text",
      placeholder: "Ví dụ: kWh, m3, tháng",
      column: 1,
      rules: { required: { value: true, message: "Vui lòng nhập đơn vị tính" } },
    },
    {
      name: "price",
      label: "Đơn giá",
      type: "number",
      placeholder: "Nhập giá tiền",
      hideSpin: true,
      unit: "VND",
      column: 2,
      rules: {
        required: { value: true, message: "Vui lòng nhập đơn giá" },
        min: { value: 0, message: "Giá tiền không được âm" },
        max: { value: 5000000, message: "Giá tiền quá cao giới hạn" },
      },
    },
  ];

  const serviceDefaultValues = selectedService
    ? {
      name: selectedService.name,
      type: selectedService.type,
      unit: selectedService.unit,
      price: selectedService.price,
    }
    : undefined;

  return (
    <div className="w-full h-full flex flex-col gap-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-card-title drop-shadow-sm">Cấu Hình Dịch Vụ</h1>
          <p className="text-sm font-medium text-card-text">Thiết lập đơn giá dịch vụ áp dụng cho phòng thuê.</p>
        </div>
        <button
          onClick={handleOpenAddService}
          className="flex items-center gap-2 bg-btn-solid hover:bg-btn-solid-hover text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={20} /> Thêm Dịch Vụ
        </button>
      </div>

      <div className="bg-card-bg border border-card-border backdrop-blur-xl rounded-3xl p-4 shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-card-title">Rate Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((item) => {
            const cfg = getServiceIconConfig(item.type);
            const textColors = {
              electricity: "text-service-electricity-text",
              water: "text-service-water-text",
              internet: "text-service-internet-text",
              trash: "text-service-trash-text",
              other: "text-service-other-text",
            };
            return (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white/20 dark:bg-black/10 border border-card-border rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-md ${cfg.bg}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-card-title">{item.name}</span>
                    <span className="text-xs font-medium text-card-text">mỗi {item.unit}</span>
                  </div>
                </div>
                <span className={`font-bold text-base ${textColors[item.type] || "text-blue-500"}`}>
                  {new Intl.NumberFormat("vi-VN").format(item.price)} VND
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-2 bg-card-bg backdrop-blur-xl border border-card-border rounded-[20px] shadow-sm">
          <MasterSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Tìm kiếm dịch vụ theo tên dịch vụ..."
          />
        </div>

        <MasterTable data={filteredServices} columns={columns} emptyMessage="Không tìm thấy dịch vụ nào" />
      </div>

      <MasterForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedService(null);
        }}
        title={isEditMode ? `Cập nhật: ${selectedService?.name}` : "Thêm Dịch Vụ Mới"}
        subtitle={isEditMode ? "Chỉnh sửa biểu phí dịch vụ cho các chu kỳ sau." : "Tạo dịch vụ mới để gán cho khách thuê khi tính tiền phòng."}
        icon={<Settings size={28} />}
        iconBgClass={isEditMode ? "bg-purple-500" : "bg-blue-500"}
        fields={formFields}
        defaultValues={serviceDefaultValues}
        onSubmit={handleFormSubmit}
        submitText={isEditMode ? "Lưu Cấu Hình" : "Tạo Dịch Vụ"}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleDeleteService}
        title="Xóa Dịch Vụ"
        message={`Bạn có chắc chắn muốn xóa dịch vụ "${selectedService?.name}" không? Khi xóa, các phòng đang sử dụng dịch vụ này sẽ bị gỡ bỏ dịch vụ tương ứng khỏi hóa đơn tính tiền.`}
        confirmText="Xóa Ngay"
        cancelText="Giữ Lại"
        variant="danger"
        icon={<AlertTriangle size={24} />}
      />
    </div>
  );
}