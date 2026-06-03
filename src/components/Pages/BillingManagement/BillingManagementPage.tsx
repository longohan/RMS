import { useState, useMemo } from "react";
import { Plus, Download, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import MasterSearch from "@/components/Atoms/Search/MasterSearch";
import MasterTable, { type TableColumn } from "@/components/Organisms/Table/MasterTable";
import MasterForm, { type FormField } from "@/components/Organisms/Form/MasterForm";
import { InvoiceStatus, type InvoiceStatusType, MOCK_INVOICES } from "@/constants/constants";

interface InvoiceData {
  id: string;
  roomNumber: string;
  tenantName: string;
  amount: number;
  issueDate: string;
  status: InvoiceStatusType;
}

const INVOICE_STATUS_LABELS: Record<InvoiceStatusType, string> = {
    [InvoiceStatus.Pending]: "Đang chờ",
    [InvoiceStatus.Paid]: "Đã trả",
    [InvoiceStatus.Overdue]: "Quá hạn",
};

const INVOICE_STATUS_STYLES: Record<InvoiceStatusType, string> = {
    [InvoiceStatus.Paid]: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    [InvoiceStatus.Pending]: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    [InvoiceStatus.Overdue]: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
};

interface CreateInvoiceFormData {
    roomNumber: string;
    amount: number;
    issueDate: string;
    status: InvoiceStatusType;
}

export default function BillingManagementPage() {
    const [invoices, setInvoices] = useState<InvoiceData[]>(MOCK_INVOICES);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<InvoiceStatusType | "All">("All");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const metrics = useMemo(() => {
        return {
            paid: invoices.filter((inv) => inv.status === InvoiceStatus.Paid).length,
            pending: invoices.filter((inv) => inv.status === InvoiceStatus.Pending).length,
            overdue: invoices.filter((inv) => inv.status === InvoiceStatus.Overdue).length,
        };
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter((inv) => {
            const matchesFilter = activeFilter === "All" || inv.status === activeFilter;
            const matchesSearch =
                inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.roomNumber.includes(searchQuery) ||
                inv.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [invoices, searchQuery, activeFilter]);

    const handleCreateInvoiceSubmit = (data: CreateInvoiceFormData) => {
        const newInvoice: InvoiceData = {
            id: `INV-${Math.floor(1000000 + Math.random() * 9000000)}`,
            roomNumber: data.roomNumber,
            tenantName: "Khách thuê phòng",
            amount: data.amount,
            issueDate: data.issueDate,
            status: Number(data.status) as InvoiceStatusType,
        };
        setInvoices((prev) => [newInvoice, ...prev]);
        setIsFormOpen(false);
    };

    const handleUpdateStatus = (id: string, newStatus: InvoiceStatusType) => {
        setInvoices((prev) =>
            prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
        );
    };

    const columns: TableColumn<InvoiceData>[] = [
        {
            header: "Mã Hóa Đơn",
            cell: (inv) => <span className="font-bold text-blue-600 dark:text-blue-400">{inv.id}</span>,
        },
        {
            header: "Phòng",
            align: "center",
            cell: (inv) => (
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg font-bold text-xs">
                    {inv.roomNumber}
                </span>
            ),
        },
        {
            header: "Người thuê",
            cell: (inv) => <span className="font-semibold text-layout-text">{inv.tenantName}</span>,
        },
        {
            header: "Số tiền",
            cell: (inv) => (
                <span className="font-bold text-blue-600 dark:text-slate-200">
                    {new Intl.NumberFormat("vi-VN").format(inv.amount)} VND
                </span>
            ),
        },
        {
            header: "Ngày lập",
            align: "center",
            cell: (inv) => <span className="font-medium text-card-text text-sm">{inv.issueDate}</span>,
        },
        {
            header: "Trạng thái",
            align: "center",
            cell: (inv) => (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${INVOICE_STATUS_STYLES[inv.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${inv.status === InvoiceStatus.Paid ? "bg-invoice-paid-text" : inv.status === InvoiceStatus.Pending ? "bg-invoice-pending-text" : "bg-invoice-overdue-text"
                        }`} />
                    {INVOICE_STATUS_LABELS[inv.status]}
                </span>
            ),
        },
        {
            header: "Thao Tác",
            align: "center",
            cell: (inv) => (
                <div className="flex items-center justify-end gap-2">
                    {inv.status !== InvoiceStatus.Paid && (
                        <button
                            onClick={() => handleUpdateStatus(inv.id, InvoiceStatus.Paid)}
                            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                            Thanh toán
                        </button>
                    )}
                    <button
                        onClick={() => alert(`Đang xuất tệp PDF của hóa đơn ${inv.id}`)}
                        className="p-2 bg-card-icon-bg border border-card-icon-border text-card-text hover:text-blue-500 rounded-xl transition-all hover:bg-white dark:hover:bg-gray-800 cursor-pointer"
                    >
                        <Download size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const formFields: FormField<CreateInvoiceFormData>[] = [
        {
            name: "roomNumber",
            label: "Số Phòng",
            type: "text",
            placeholder: "Ví dụ: 101, 201...",
            column: 1,
            rules: { required: { value: true, message: "Vui lòng nhập số phòng" } },
        },
        {
            name: "status",
            label: "Trạng thái hóa đơn",
            type: "select",
            placeholder: "Chọn trạng thái ban đầu",
            column: 1,
            options: [
                { label: "Chờ thanh toán (Pending)", value: InvoiceStatus.Pending },
                { label: "Đã đóng tiền (Paid)", value: InvoiceStatus.Paid },
            ],
            rules: { required: { value: true, message: "Vui lòng chọn trạng thái" } },
        },
        {
            name: "amount",
            label: "Tổng tiền hóa đơn",
            type: "number",
            placeholder: "Nhập tổng số tiền cần thu",
            hideSpin: true,
            unit: "VND",
            column: 2,
            rules: {
                required: { value: true, message: "Vui lòng nhập tổng tiền" },
                min: { value: 0, message: "Số tiền hóa đơn không được phép âm" },
            },
        },
        {
            name: "issueDate",
            label: "Ngày lập hóa đơn",
            type: "date",
            column: 2,
            rules: { required: { value: true, message: "Vui lòng chọn ngày xuất hóa đơn" } },
        },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-6 pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-card-title drop-shadow-sm">Quản lý thanh toán</h1>
                    <p className="text-sm font-medium text-card-text">Theo dõi tất cả hóa đơn thuê, thanh toán và số dư còn lại.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-btn-solid hover:bg-btn-solid-hover text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                    <Plus size={20} /> Tạo hóa đơn
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-card-bg border border-card-border backdrop-blur-xl rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-invoice-paid-text font-bold text-sm">
                        <span className="w-2 h-2 rounded-full bg-invoice-paid-text" /> 
                        Đã đóng tiền
                    </div>
                    <span className="text-4xl font-black text-card-title">{metrics.paid}</span>
                    <span className="text-xs font-semibold text-card-text uppercase tracking-wider">hóa đơn</span>
                    <CheckCircle2 className="absolute right-6 bottom-6 text-invoice-paid-icon pointer-events-none" size={64} />
                </div>

                <div className="bg-card-bg border border-card-border backdrop-blur-xl rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-invoice-pending-text font-bold text-sm">
                        <span className="w-2 h-2 rounded-full bg-invoice-pending-text" />
                        Đang chờ thanh toán
                    </div>
                    <span className="text-4xl font-black text-card-title">{metrics.pending}</span>
                    <span className="text-xs font-semibold text-card-text uppercase tracking-wider">hóa đơn</span>
                    <Clock className="absolute right-6 bottom-6 text-invoice-pending-icon pointer-events-none" size={64} />
                </div>

                <div className="bg-card-bg border border-card-border backdrop-blur-xl rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-invoice-overdue-text font-bold text-sm">
                        <span className="w-2 h-2 rounded-full bg-invoice-overdue-text" />
                        Quá hạn
                    </div>
                    <span className="text-4xl font-black text-card-title">{metrics.overdue}</span>
                    <span className="text-xs font-semibold text-card-text uppercase tracking-wider">hóa đơn</span>
                    <AlertCircle className="absolute right-6 bottom-6 text-invoice-overdue-icon pointer-events-none" size={64} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 p-2 bg-card-bg backdrop-blur-xl border border-card-border rounded-[20px] shadow-sm">
                <MasterSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder="Tìm kiếm theo mã hóa đơn, phòng hoặc tên người thuê"
                />

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 liquid-scrollbar">
                    {([
                        { label: "Tất cả", value: "All" },
                        { label: "Đã trả", value: InvoiceStatus.Paid },
                        { label: "Đang chờ", value: InvoiceStatus.Pending },
                        { label: "Quá hạn", value: InvoiceStatus.Overdue },
                    ] as const).map((filter) => (
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
                data={filteredInvoices}
                columns={columns}
                emptyMessage="No invoice found with the matching criteria"
            />

            <MasterForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="Tạo hóa đơn"
                subtitle="Tạo hóa đơn thanh toán tiền thuê nhà riêng biệt cho từng phòng của người thuê nhà"
                icon={<FileText size={28} />}
                iconBgClass="bg-blue-600"
                fields={formFields}
                onSubmit={handleCreateInvoiceSubmit}
                submitText="Generate Invoice"
            />
        </div>
    );
}