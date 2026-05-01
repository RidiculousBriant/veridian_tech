import type { Table } from "@/types/table";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Users, MapPin, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  table: Table;
  onToggle?: (id: number) => void;
  variant?: "admin" | "customer";
};

const statusStyles = {
  vacant: {
    badge: "bg-green-600 text-white",
    ring: "ring-green-500/20",
    dot: "bg-green-400",
    label: "Vacant",
  },
  occupied: {
    badge: "bg-red-800 text-white",
    ring: "ring-green-500/20",
    dot: "bg-red-700",
    label: "Occupied",
  },
} as const;

export function TableCard({ table, onToggle, variant = "admin" }: Props) {
  const s = statusStyles[table.status];
  const isOccupied = table.status === "occupied";

  return (
    <Card
      className={cn(
        "text-white pt-0 group relative overflow-hidden rounded-2xl border-0 bg-linear-to-br from-green-900 to-green-800 ring-1 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col",
        s.ring,
      )}
    >
      {/* Glow effect */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-green-400 opacity-[0.08] blur-2xl group-hover:opacity-[0.15]" />

      {/* HEADER */}
      <CardHeader className="flex flex-col items-center justify-center gap-2 pb-0 px-3">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs my-5 uppercase tracking-wider text-green-200">
            {table.type}
          </p>

          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm",
              s.badge,
            )}
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", s.dot)} />
            <span>{s.label}</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-center w-full">
          {table.name}
        </h3>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="px-3 flex-1">
        <div className="my-5 grid grid-cols-2 gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-green-700/60 px-3 py-2">
            <Users className="h-4 w-4 text-green-200" />
            <span>{table.seats} seats</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-green-700/60 px-3 py-2">
            <MapPin className="h-4 w-4 text-green-200" />
            <span>{table.type}</span>
          </div>
        </div>
      </CardContent>

      {/* FOOTER */}
      {variant === "admin" && onToggle && (
        <CardFooter className="px-3 py-4 flex gap-2 border-0">
          <Button
            onClick={() => onToggle(table.id)}
            className={cn(
              "flex-1 rounded-xl flex items-center justify-center gap-2",
              isOccupied
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600",
            )}
          >
            {isOccupied ? (
              <>
                <XCircle className="h-4 w-4" />
                Free up
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Occupy
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
