// src/components/Organisms/MasterForm.tsx
import { useState, type ReactNode } from "react";
import { X, AlertCircle } from "lucide-react";
import MasterSelect from "@/components/Atoms/Select/MasterSelect";

export interface FormRule {
  required?: { value: boolean; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
}

export interface FormField<T> {
  name: keyof T;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  unit?: string;
  column?: 1 | 2;
  options?: { label: string; value: string | number }[];
  rules?: FormRule;
  hideSpin?: boolean;
}

interface MasterFormProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconBgClass: string;
  fields: FormField<T>[];
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void;
  submitText: string;
  subContent?: ReactNode;
}

export default function MasterForm<T>({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconBgClass,
  fields,
  defaultValues,
  onSubmit,
  submitText,
  subContent,
}: MasterFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [prevFormOpen, setPrevFormOpen] = useState(defaultValues);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (defaultValues !== prevFormOpen) {
    setPrevFormOpen(defaultValues);
    setFormData(defaultValues || {});
    setErrors({});
  }
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setErrors({});
    } else {
      setFormData(defaultValues || {});
      setErrors({});
    }
  }

  if (!isOpen) return null;


  const validateSingleField = (name: keyof T, value: any) => {
    const field = fields.find((f) => f.name === name);
    if (!field || !field.rules) return "";

    const rules = field.rules;


    if (rules.required?.value && (value === undefined || value === null || value === "")) {
      return rules.required.message;
    }

    if (value !== undefined && value !== null && value !== "") {
      if (field.type === "number") {
        const numValue = Number(value);
        if (isNaN(numValue)) return "";

        if (rules.min && numValue < rules.min.value) {
          return rules.min.message;
        }
        if (rules.max && numValue > rules.max.value) {
          return rules.max.message;
        }
      } 

      else {
        const strValue = String(value);
        if (rules.minLength && strValue.length < rules.minLength.value) {
          return rules.minLength.message;
        }
        if (rules.maxLength && strValue.length > rules.maxLength.value) {
          return rules.maxLength.message;
        }
        if (rules.pattern && !rules.pattern.value.test(strValue)) {
          return rules.pattern.message;
        }
      }
    }

    return "";
  };

  const handleFieldChange = (name: keyof T, value: any) => {

    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);


    const errorMsg = validateSingleField(name, value);


    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg ? errorMsg : undefined,
    }));
  };


  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    fields.forEach((field) => {
      const value = formData[field.name];
      const errorMsg = validateSingleField(field.name, value);
      if (errorMsg) {
        newErrors[field.name] = errorMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData as T);
    }
  };


  const renderField = (field: FormField<T>) => {
    const errorMsg = errors[field.name];
    const isError = !!errorMsg;

    let inputClasses = `w-full p-3 bg-input-bg border rounded-xl outline-none transition-all text-layout-text placeholder:text-input-icon/70 
      ${isError ? "border-red-500 focus:ring-2 focus:ring-red-500/30" : "border-card-border focus:ring-2 focus:ring-blue-400/50"} 
      ${field.unit ? "pr-16" : ""} 
      ${field.type === "textarea" ? "resize-none liquid-scrollbar" : ""}`;

    if (field.type === "number" && field.hideSpin) {
      inputClasses += ` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
    }

    return (
      <div key={String(field.name)} className={`flex flex-col gap-1.5 ${field.column === 2 ? "col-span-2" : "col-span-1"}`}>
        <label className="text-xs font-bold text-card-text uppercase tracking-wider">
          {field.label} {field.rules?.required?.value && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          {field.type === "textarea" ? (
            <textarea
              rows={3}
              placeholder={field.placeholder}
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              maxLength={field.rules?.maxLength?.value}
              className={inputClasses}
            />
          ) : field.type === "select" ? (
            <MasterSelect
              value={formData[field.name] as string}
              onChange={(value) => handleFieldChange(field.name, value)}
              options={field.options || []}
              placeholder={field.placeholder}
              className={inputClasses}
            />
          ) : (
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] === undefined || formData[field.name] === null ? "" : (formData[field.name] as string | number)}
              onChange={(e) => {
                const val = e.target.value;
                let finalVal = field.type === "number" ? (val === "" ? "" : Number(val)) : val;

                if (field.type === "number" && typeof finalVal === "number" && field.rules) {
                  if (field.rules.max && finalVal > field.rules.max.value) {
                    finalVal = field.rules.max.value;
                  }
                }
                handleFieldChange(field.name, finalVal);
              }}
              min={field.rules?.min?.value}
              max={field.rules?.max?.value}
              maxLength={field.rules?.maxLength?.value}
              className={inputClasses}
            />
          )}

          {field.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-card-text font-bold text-sm pointer-events-none">
              {field.unit}
            </span>
          )}
        </div>

        {isError && (
          <div className="flex items-center gap-1 mt-0.5 text-red-500 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle size={12} />
            <span className="text-xs font-semibold">{errorMsg}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-linear-to-tr from-bg-start via-bg-middle to-bg-end border border-card-border rounded-4xl p-8 shadow-2xl ">
        <button onClick={onClose} type="button" className="absolute top-6 right-6 p-2 bg-btn-glass-bg border border-btn-glass-border text-card-text hover:text-layout-text rounded-full cursor-pointer">
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${iconBgClass}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-title">{title}</h2>
            <p className="text-sm font-medium text-card-text">{subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => renderField(field))}
          </div>

          {subContent}

          <div className="flex items-center gap-4 mt-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-btn-glass-bg border border-btn-glass-border rounded-2xl font-bold text-layout-text hover:bg-btn-glass-hover transition-all cursor-pointer">
              Hủy
            </button>
            <button type="submit" className="flex-1 py-3 px-4 bg-btn-solid hover:bg-btn-solid-hover rounded-2xl font-bold text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all cursor-pointer">
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}