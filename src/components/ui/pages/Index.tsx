import { useMemo, useState } from "react";
import type { Table, TableStatus } from "@/types/table";
import { TableCard } from "@/components/ui/TableCard";
import {
  UtensilsCrossed,
  CircleDot,
  Users2,
  Grid3X3,
  CheckCircle2,
  Table2,
} from "lucide-react";

import { useTableStore } from "@/store/useTableStore";

const Index = () => {
  const tables = useTableStore((state) => state.tables ?? []);
  const toggleTable = useTableStore((state) => state.toggleTable);
  const [filter, setFilter] = useState<"all" | TableStatus>("all");

  const stats = useMemo(() => {
    return {
      total: tables.length,
      vacant: tables.filter((t) => t.status === "vacant").length,
      occupied: tables.filter((t) => t.status === "occupied").length,
    };
  }, [tables]);

  // ================================
  // FILTERED TABLES
  // ================================
  const filteredTables =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);

  // ================================
  // GROUP BY SEATS
  // ================================
  function getSectionLabel(seats: number) {
    if (seats <= 2) return "1–2 Persons";
    if (seats <= 6) return "3–6 Persons";
    return "6–10 Persons";
  }

  const groupedTables = filteredTables.reduce(
    (acc, table) => {
      const key = getSectionLabel(table.seats);
      if (!acc[key]) acc[key] = [];
      acc[key].push(table);
      return acc;
    },
    {} as Record<string, Table[]>,
  );

  const filters: {
    key: "all" | TableStatus;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "all",
      label: "All",
      icon: <Grid3X3 className="w-4 h-4" />,
    },
    {
      key: "vacant",
      label: "Vacant",
      icon: <CircleDot className="w-4 h-4" />,
    },
    {
      key: "occupied",
      label: "Occupied",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  console.log("ADMIN STORE", useTableStore.getState().tables);

  return (
    <div className="min-h-screen text-black px-10 md:px-20 pb-10">
      {/* HEADER */}
      <header className="pt-10">
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

      {/* STATS */}
      <div className="mt-6 mb-15 grid grid-cols-3 gap-4 text-white">
        <StatCard
          icon={<CircleDot />}
          label="Total Tables"
          value={stats.total}
        />
        <StatCard icon={<Users2 />} label="Vacant" value={stats.vacant} />
        <StatCard
          icon={<UtensilsCrossed />}
          label="Occupied"
          value={stats.occupied}
        />
      </div>

      {/* FILTER */}
      <div className="my-6 flex">
        <div className="flex flex-wrap gap-2 bg-green-100 p-2 rounded-full shadow-sm">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === f.key
                  ? "bg-green-600 text-white shadow"
                  : "text-green-700 hover:bg-green-200"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE GRID WITH SECTIONS */}
      <div className="space-y-10">
        {Object.entries(groupedTables).map(([section, tables]) => (
          <div key={section}>
            {/* SECTION TITLE */}
            <h3 className="mb-4 text-lg font-semibold text-dark">{section}</h3>

            {/* TABLES */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onToggle={toggleTable}
                  variant="admin"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredTables.length === 0 && (
        <div className="flex flex-col h-75 items-center justify-center mt-16 text-center text-gray-500">
          {/* ICON */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-gray-300">
            <Table2 className="h-6 w-6" />
          </div>

          {/* TEXT */}
          <p className="text-lg font-medium text-dark">No tables available</p>

          <p className="text-sm text-dark mt-1">
            Try changing your filter or add new tables
          </p>
        </div>
      )}
    </div>
  );
};

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-900 to-green-800 p-4 ring-1 ring-green-500/20 flex justify-between items-center transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-green-400 opacity-[0.08] blur-2xl" />

      <div>
        <p className="text-sm text-green-200">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>

      <div className="text-green-300">{icon}</div>
    </div>
  );
}

export default Index;
