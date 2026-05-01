import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Table } from "@/types/table";
import { initialTables } from "@/data/initialTables";

type TableStore = {
  tables: Table[];
  setTables: (tables: Table[]) => void;
  resetTables: () => void;
  toggleTable: (id: number) => void;
  clearTable: (id: number) => void;
};

const cloneTables = (): Table[] =>
  initialTables.map((t) => ({ ...t }));

export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      tables: cloneTables(),

      setTables: (tables) => set({ tables }),

      resetTables: () => set({ tables: cloneTables() }),

      toggleTable: (id) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: t.status === "vacant" ? "occupied" : "vacant",
                }
              : t
          ),
        })),

      clearTable: (id) =>
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === id ? { ...t, status: "vacant" } : t
          ),
        })),
    }),
    {
      name: "table-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);