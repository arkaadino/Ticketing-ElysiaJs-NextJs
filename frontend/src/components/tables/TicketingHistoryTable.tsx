"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import useTicketing from "@/hooks/useTicketing";
import { useRouter } from "next/navigation";

export default function ticketingHistory() {
  const router = useRouter();
  const { ticketingHistoryList, fetchHistory } = useTicketing();
  const [selectedTicketing, setSelectedTicketing] = useState<any>(null);
  const [selectedTicketingId, setSelectedTicketingId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [ticketingHistoryList]);


  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleDetailClick = (id: string) => {
    router.push(`/ticketing/detail/${id}`); // ⬅️ push ke halaman detail
  };

  return ( 
    <div className="overflow-hidden">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kategori</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Karyawan</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Eskalasi</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Keluhan</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tanggal Keluhan</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status Aktif</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {ticketingHistoryList.map((ticketing, index) => (
                <TableRow key={ticketing.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">{index + 1}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge 
                      size="sm" 
                      color={(() => {
                        switch (ticketing.Status?.name) {
                          case "Completed":
                            return "success";  // badge warna hijau untuk Completed
                          case "Pending":
                            return "error";    // badge warna merah untuk Pending
                          case "Open":
                            return "info";     // badge warna biru untuk Open
                          case "Ongoing":
                            return "warning";  // badge warna kuning untuk Ongoing
                        }
                      })()}
                    >
                      {ticketing.Status?.name}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ticketing.Category?.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ticketing.Karyawan?.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ticketing.Eskalasi?.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ticketing.keluhan}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ticketing.tanggal_keluhan}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={ticketing.is_active ? "success" : "error"}>
                      {ticketing.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        className="px-3 py-1 bg-brand-400 text-white rounded hover:bg-brand-500 transition"
                        onClick={() => handleDetailClick(ticketing.id)}
                      >
                        Detail
                      </Button>                    
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Edit Modal */}
      {/* <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="max-w-[584px] p-5 lg:p-10">
        {selectedTicketingId && (
          <EditTicketingForm 
            id={selectedTicketingId}
            initialData={selectedTicketing}
            closeModal={closeEditModal} 
          />
        )}
      </Modal> */}
      
    </div>
  );
}