export type TableStatus = "vacant" | "occupied" | "reserved" | "cleaning in progress";

export type Table = {
  id: number;
  name: string;
  type: string;
  capacity: string;
  seats: number;
  status: TableStatus;
  customerName?: string;
  customerSeats?: number;
};