export type TableStatus = "vacant" | "occupied";

export type Table = {
  id: number;
  name: string;
  type: string;
  seats: number;
  status: TableStatus;
  customerName?: string;
};