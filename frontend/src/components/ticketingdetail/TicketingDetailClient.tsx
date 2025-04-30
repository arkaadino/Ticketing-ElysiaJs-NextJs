// app/ticketing/detail/[id]/TicketingDetailClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import StatusCard from "./StatusCard";
import TicketingInfoCard from "./TicketingInfoCard";
import useTicketing from "@/hooks/useTicketing";

export default function TicketingDetailClient() {
  const params = useParams();
  const ticketId = params.id as string;
  const { ticketing, loading, selectTicketing, updateTicketing } = useTicketing();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTicketData = async () => {
      if (ticketId) {
        await selectTicketing(ticketId);
      }
      setIsLoading(false);
    };
    
    fetchTicketData();
  }, [ticketId, selectTicketing]);

  const handleStatusUpdate = async (statusData: any) => {
    if (ticketId) {
      if (statusData.id_eskalasi) {
        statusData.id_eskalasis = statusData.id_eskalasi;
        delete statusData.id_eskalasi;
      }
      await updateTicketing(ticketId, statusData);
      await selectTicketing(ticketId);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!ticketing) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Tiket tidak ditemukan atau Anda tidak memiliki akses.
      </div>
    );
  }

  const getStatusName = () => {
    if (ticketing.Status) return ticketing.Status.name;
    switch (ticketing.id_statuses) {
      case 1: return "Completed";
      case 2: return "Ongoing";
      case 3: return "Open";
      case 4: return "Pending";
      default: return "Unknown";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <ComponentCard title={`Ticketing - ${ticketId}`}>
        <TicketingInfoCard ticketing={ticketing} />
      </ComponentCard>
      
      <ComponentCard title={`Status - ${getStatusName()}`}>
        <StatusCard ticketing={ticketing} onStatusUpdate={handleStatusUpdate} />
      </ComponentCard>
    </div>
  );
}
