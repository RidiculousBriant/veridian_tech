import { useEffect, useState } from "react";
import type { Table, TableStatus } from "@/types/table";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableStore } from "@/store/useTableStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

type Props = {
  table: Table;
  variant?: "admin" | "customer";
};

const statusStyles: Record<
  TableStatus,
  {
    badge: string;
    ring: string;
    dot: string;
    label: string;
    button: string;
  }
> = {
  vacant: {
    badge: "bg-green-600 text-white",
    ring: "ring-green-500/20",
    dot: "bg-green-400",
    label: "Vacant",
    button: "bg-green-500 hover:bg-green-600",
  },
  reserved: {
    badge: "bg-blue-600 text-white",
    ring: "ring-blue-500/20",
    dot: "bg-blue-400",
    label: "Reserved",
    button: "bg-blue-500 hover:bg-blue-600",
  },
  occupied: {
    badge: "bg-red-700 text-white",
    ring: "ring-red-500/20",
    dot: "bg-red-500",
    label: "Occupied",
    button: "bg-red-500 hover:bg-red-600",
  },
  "cleaning in progress": {
    badge: "bg-yellow-500 text-black",
    ring: "ring-yellow-400/30",
    dot: "bg-yellow-300",
    label: "Cleaning",
    button: "bg-yellow-400 hover:bg-yellow-500 text-black",
  },
};

const statusOptions: TableStatus[] = [
  "vacant",
  "reserved",
  "occupied",
  "cleaning in progress",
];

export function TableCard({ table, variant = "admin" }: Props) {
  const maxSeats = table.seats;
  const s = statusStyles[table.status];

  const setStatus = useTableStore((s) => s.setStatus);
  const setTableDetails = useTableStore((s) => s.setTableDetails);

  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TableStatus | null>(null);

  const [name, setName] = useState("");
  const [seatInput, setSeatInput] = useState(1);

  const statusMessages: Record<TableStatus, string> = {
    vacant: "is now vacant",
    reserved: "has been reserved",
    occupied: "is now occupied",
    "cleaning in progress": "is being cleaned",
  };

  let minSeats = 1;

  if (maxSeats <= 2) minSeats = 1;
  else if (maxSeats <= 6) minSeats = 3;
  else if (maxSeats <= 10) minSeats = 6;

  const seatOptions = Array.from(
    { length: maxSeats - minSeats + 1 },
    (_, i) => minSeats + i,
  );

  useEffect(() => {
    if (!open) return;

    setName(table.customerName || "");

    let initialSeats =
      table.customerSeats && table.customerSeats > 0
        ? table.customerSeats
        : minSeats;

    // clamp inside range
    if (initialSeats < minSeats) initialSeats = minSeats;
    if (initialSeats > maxSeats) initialSeats = maxSeats;

    setSeatInput(initialSeats);
  }, [open, minSeats, maxSeats]);

  // ==========================
  // STATUS CLICK
  // ==========================
  const handleStatusClick = (status: TableStatus) => {
    if (status === "reserved" || status === "occupied") {
      setPendingStatus(status);
      setOpen(true);
      return;
    }

    setStatus(table.id, status);

    toast.success(`Table ${table.name} ${statusMessages[status]}`);
  };

  // ==========================
  // SAVE
  // ==========================
  const handleSave = () => {
    if (pendingStatus) {
      setStatus(table.id, pendingStatus);

      setTableDetails(table.id, {
        name,
        seats: seatInput,
      });

      toast.success(
        `Table ${table.name} ${statusMessages[pendingStatus]} (${seatInput} seats)`,
      );
    }

    setOpen(false);
    setPendingStatus(null);
  };

  return (
    <>
      <Card
        className={cn(
          "text-white pt-0 group relative overflow-hidden rounded-2xl border-0 bg-linear-to-br from-green-900 to-green-800 ring-1 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col",
          s.ring,
        )}
      >
        <CardHeader className="flex flex-col items-center justify-center pb-0 px-3">
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

          <h3 className="text-2xl font-bold text-center w-full">
            {table.name}
          </h3>

          <div className="mt-2 w-full min-h-16 flex flex-col items-center justify-center">
            {table.customerName ? (
              <p className="text-lg text-green-200 text-center">
                {table.customerName}
              </p>
            ) : (
              <>
                <div className="w-full border-green-700/60 mb-2" />

                <p className="text-sm text-green-300 font-medium">
                  Available Seats: {table.seats}
                </p>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-3 flex-1">
          <div className="my-5 grid grid-cols-2 gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-green-700/60 px-3 py-2">
              <Users className="h-4 w-4 text-green-200" />
              <span>{table.customerSeats ?? table.seats} seats</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-green-700/60 px-3 py-2">
              <MapPin className="h-4 w-4 text-green-200" />
              <span>{table.type}</span>
            </div>
          </div>
        </CardContent>

        {variant === "admin" && (
          <CardFooter className="px-3 py-4 flex flex-col gap-2">
            <div className="w-full flex gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  onClick={() => handleStatusClick(status)}
                  className={cn(
                    "flex-1 text-xs",
                    statusStyles[status].button,
                    table.status === status && "ring-2 ring-white",
                  )}
                >
                  {statusStyles[status].label}
                </Button>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>

      {/* ========================== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-green-950 border border-green-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-green-300">
              Table Details for {table.name}
            </DialogTitle>
          </DialogHeader>

          {/* NAME */}
          <div className="space-y-1">
            <label className="text-sm text-green-300">Customer Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Customer Name"
              className="w-full rounded-lg px-3 py-2 bg-green-900 border border-green-700 text-white mt-2"
            />
          </div>

          {/* SEATS */}
          <div className="space-y-1">
            {/* SEATS INPUT */}
            <div className="space-y-1 mt-3">
              <label className="text-sm text-green-300">
                Number of Seats ({minSeats} - {maxSeats})
              </label>

              <Select
                value={seatInput.toString()}
                onValueChange={(value) => setSeatInput(Number(value))}
              >
                <SelectTrigger className="w-full bg-green-900 border-green-700 text-white mt-2">
                  <SelectValue placeholder="Select seats" />
                </SelectTrigger>

                <SelectContent className="bg-green-950 border-green-800 text-white">
                  {seatOptions.map((seat) => (
                    <SelectItem key={seat} value={seat.toString()}>
                      {seat} {seat === 1 ? "seat" : "seats"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
