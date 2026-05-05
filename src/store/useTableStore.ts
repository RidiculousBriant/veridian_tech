import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Table, TableStatus } from "@/types/table";
import { initialTables } from "@/data/initialTables";

type TableStore = {
  tables: Table[];

  setTables: (tables: Table[]) => void;
  resetTables: () => void;

  toggleTable: (id: number) => void;
  clearTable: (id: number) => void;

  // ✅ CUSTOMER DATA
  setCustomerName: (id: number, name: string) => void;

  // ✅ STATUS CONTROL
  setStatus: (id: number, status: TableStatus) => void;

  // ✅ NEW (for your dialog requirement: name + seats together)
  setTableDetails: (
    id: number,
    data: { name: string; seats: number }
  ) => void;
};

const cloneTables = (): Table[] =>
  initialTables.map((t) => ({ ...t }));

export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      tables: cloneTables(),

      // ========================
      // SET TABLES
      // ========================
      setTables: (tables) => set({ tables }),

      // ========================
      // RESET TABLES
      // ========================
      resetTables: () => set({ tables: cloneTables() }),

      // ========================
      // TOGGLE (OPTIONAL)
      // ========================
      toggleTable: (id) =>
        set((state) => ({
          tables: state.tables.map((t) => {
            if (t.id !== id) return t;

            const order: TableStatus[] = [
              "vacant",
              "reserved",
              "occupied",
              "cleaning in progress",
            ];

            const nextStatus =
              order[(order.indexOf(t.status) + 1) % order.length];

            return {
              ...t,
              status: nextStatus,
              customerName:
                nextStatus === "vacant" ? undefined : t.customerName,
            };
          }),
        })),

      // ========================
      // SET STATUS (MAIN CONTROL)
      // ========================
setStatus: (id, status) =>
  set((state) => ({
    tables: state.tables.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            customerName:
              status === "vacant" || status === "cleaning in progress"
                ? undefined
                : t.customerName,

            customerSeats:
              status === "vacant" || status === "cleaning in progress"
                ? undefined
                : t.customerSeats,
          }
        : t
    ),
  })),

      // ========================
      // CLEAR TABLE
      // ========================
      clearTable: (id) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "vacant",
                  customerName: undefined,
                }
              : t
          ),
        })),

      // ========================
      // SET CUSTOMER NAME ONLY
      // ========================
      setCustomerName: (id, name) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  customerName: name,
                }
              : t
          ),
        })),

setTableDetails: (id, data) =>
  set((state) => ({
    tables: state.tables.map((t) =>
      t.id === id
        ? {
            ...t,
            customerName: data.name,
            customerSeats: data.seats, 
          }
        : t
    ),
  })),
    }),
    {
      name: "table-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);