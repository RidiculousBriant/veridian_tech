"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "@/components/ui/pages/Index";
import NotFound from "@/components/ui/pages/NotFound";
import CustomerTables from "@/components/ui/pages/CustomerTables";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className:
              "bg-green-900 border border-green-700 text-green-100 shadow-lg",
          }}
        />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customerTables" element={<CustomerTables />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
