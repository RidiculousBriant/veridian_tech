import { TableCard } from "@/components/ui/TableCard";
import { useTableStore } from "@/store/useTableStore";
import type { Table } from "@/types/table";
import { useEffect, useMemo } from "react";

const CustomerTables = () => {
  const tables = useTableStore((state) => state.tables);
  const setTables = useTableStore((state) => state.setTables);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === "table-storage" && event.newValue) {
        const parsed = JSON.parse(event.newValue);
        setTables(parsed.state.tables);
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [setTables]);

  function getSectionLabel(seats: number) {
    if (seats <= 2) return "1–2 Persons";
    if (seats <= 6) return "3–6 Persons";
    return "6–10 Persons";
  }

  const groupedTables = useMemo(() => {
    return tables.reduce(
      (acc, table) => {
        const key = getSectionLabel(table.seats);
        if (!acc[key]) acc[key] = [];
        acc[key].push(table);
        return acc;
      },
      {} as Record<string, Table[]>,
    );
  }, [tables]);

  return (
    <div className="min-h-screen text-black px-10 md:px-20 pb-10">
      {/* HEADER */}
      <header className="pt-10 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-22 w-22 rounded-full overflow-hidden shrink-0">
              <img
                src="/logo.png"
                alt="Veridian Tech Logo"
                className="h-full w-full object-cover scale-125 object-[60%_60%]"
              />
            </div>

            <h1 className="font-bold md:text-2xl text-dark">Veridian Tech</h1>
          </div>

          <div className="text-sm text-dark font-medium">
            {new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </header>

      <div className="mb-15 mt-20 text-center">
        <h1 className="text-dark text-3xl font-bold">Available Tables</h1>
      </div>

      {tables.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No tables available
        </div>
      )}

      <div className="space-y-10">
        {Object.entries(groupedTables).map(([section, tables]) => (
          <div key={section}>
            <h3 className="mb-4 text-lg font-semibold text-dark">{section}</h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tables.map((table) => (
                <TableCard key={table.id} table={table} variant="customer" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTables;
