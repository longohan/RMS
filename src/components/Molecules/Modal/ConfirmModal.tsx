import { type ReactNode } from "react";
import { AlertTriangle, X, Info, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  icon,
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const config = {
    danger: {
      iconBg: "bg-modal-danger-bg text-modal-danger-icon border-modal-danger-border",
      btnConfirm: "bg-modal-danger-btn hover:bg-modal-danger-btn-hover shadow-red-500/20 text-white",
      defaultIcon: <AlertCircle size={24} />,
    },
    warning: {
      iconBg: "bg-modal-warning-bg text-modal-warning-icon border-modal-warning-border",
      btnConfirm: "bg-modal-warning-btn hover:bg-modal-warning-btn-hover shadow-amber-500/20 text-white",
      defaultIcon: <AlertTriangle size={24} />,
    },
    info: {
      iconBg: "bg-modal-info-bg text-modal-info-icon border-modal-info-border",
      btnConfirm: "bg-modal-info-btn hover:bg-modal-info-btn-hover shadow-blue-500/20 text-white",
      defaultIcon: <Info size={24} />,
    },
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-linear-to-tr from-bg-start via-bg-middle to-bg-end border border-card-border rounded-3xl p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 bg-btn-glass-bg border border-btn-glass-border text-card-text hover:text-layout-text rounded-full cursor-pointer transition-all duration-200"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4 mt-2">
          <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border backdrop-blur-md transition-colors duration-200 ${config[variant].iconBg}`}>
            {icon || config[variant].defaultIcon}
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <h3 className="text-xl font-bold text-card-title">{title}</h3>
            <p className="text-sm font-medium text-card-text leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-btn-glass-bg border border-btn-glass-border rounded-xl font-bold text-layout-text hover:bg-btn-glass-hover transition-all cursor-pointer text-sm"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer text-sm ${config[variant].btnConfirm}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}