import type { Table } from "@/types/table";

export const initialTables: Table[] = [
  // 1–5 (1–2 persons)
  { id: 1, name: "Table 1", type: "Two-top Table", capacity: "1-2 persons", seats: 2, status: "vacant" },
  { id: 2, name: "Table 2", type: "Two-top Table", capacity: "1-2 persons", seats: 2, status: "vacant"},
  { id: 3, name: "Table 3", type: "Two-top Table",  capacity: "1-2 persons",seats: 2, status: "vacant" },
  { id: 4, name: "Table 4", type: "Two-top Table",  capacity: "1-2 persons",seats: 2, status: "vacant" },
  { id: 5, name: "Table 5", type: "Two-top Table",  capacity: "1-2 persons",seats: 2, status: "vacant" },

  // 6–10 (3–6 persons)
  { id: 6, name: "Table 6", type: "Family Table", capacity: "3-6 persons", seats: 6, status: "vacant" },
  { id: 7, name: "Table 7", type: "Family Table", capacity: "3-6 persons", seats: 6, status: "vacant" },
  { id: 8, name: "Table 8", type: "Family Table", capacity: "3-6 persons", seats: 6, status: "vacant" },
  { id: 9, name: "Table 9", type: "Family Table", capacity: "3-6 persons", seats: 6, status: "vacant" },
  { id: 10, name: "Table 10", type: "Family Table", capacity:"3-6 persons", seats: 6, status: "vacant" },

  // 11–15 (6–10 persons)
  { id: 11, name: "Table 11", type: "Party Tables", capacity: "6-10 persons", seats: 10, status: "vacant" },
  { id: 12, name: "Table 12", type: "Party Tables", capacity: "6-10 persons", seats: 10, status: "vacant" },
  { id: 13, name: "Table 13", type: "Party Tables", capacity: "6-10 persons", seats: 10, status: "vacant" },
  { id: 14, name: "Table 14", type: "Party Tables", capacity: "6-10 persons", seats: 10, status: "vacant" },
  { id: 15, name: "Table 15", type: "Party Tables", capacity: "6-10 persons", seats: 10, status: "vacant" },
];