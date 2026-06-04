import { create } from 'zustand';
import { MOCK_INVOICES, InvoiceStatus } from '@/constants/constants';
export interface OverdueInvoice {
  id: string;
  roomNumber: string;
  amount: number;
  tenantName?: string;
}

interface NotificationState {
  overdueList: OverdueInvoice[];
  setOverdueList: (invoices: OverdueInvoice[]) => void;
  removeOverdue: (id: string) => void;
}

const initialOverdues = MOCK_INVOICES
  .filter(inv => inv.status === InvoiceStatus.Overdue)
  .map(inv => ({ id: inv.id, roomNumber: inv.roomNumber, amount: inv.amount, tenantName: inv.tenantName }));

export const useNotificationStore = create<NotificationState>((set) => ({
  overdueList: initialOverdues, 
  
  setOverdueList: (invoices) => set({ overdueList: invoices }),
  
  removeOverdue: (id) => 
    set((state) => ({
      overdueList: state.overdueList.filter((inv) => inv.id !== id)
    })),
}));