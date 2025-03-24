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
import EditEskalasiForm from "../forms/Eskalasi/EskalasiEditForm";
import useEskalasi from "../../hooks/useEskalasi";

export default function EskalasiTable() {
  const { eskalasiList, deleteEskalasi, fetchEskalasi, selectEskalasi } = useEskalasi();
  const [selectedEskalasi, setSelectedEskalasi] = useState<any>(null);
  const [selectedEskalasiId, setSelectedEskalasiId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchEskalasi();
  }, [eskalasiList]);

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedEskalasiId(null);
    setSelectedEskalasi(null);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleEditClick = async (id: string) => {
    try {
      const data = await selectEskalasi(id);
      if (data) {
        setSelectedEskalasi(data);
        setSelectedEskalasiId(id);
        setEditModalOpen(true);
      }
    } catch (error) {
      console.error("Gagal mengambil data :", error);
    }
  };
  
  return ( 
    <div className="overflow-hidden">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">NIK</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Posisi</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Unit Kerja</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jabatan</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {eskalasiList.map((eskalasi, index) => (
                <TableRow key={eskalasi.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">{index + 1}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{eskalasi.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{eskalasi.nik}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{eskalasi.position}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{eskalasi.unit_kerja}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{eskalasi.job_title}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={eskalasi.is_active ? "success" : "error"}>
                      {eskalasi.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        className="px-3 py-1 bg-warning-400 text-white rounded hover:bg-warning-500 transition"
                        onClick={() => handleEditClick(eskalasi.id)}
                      >
                        Edit
                      </Button>                    
                      <Button 
                        size="sm"
                        className="px-3 py-1 bg-error-500 text-white rounded hover:bg-error-600 transition" 
                        onClick={() => deleteEskalasi(eskalasi.id)}
                      >
                        Delete
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
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="max-w-[584px] p-5 lg:p-10">
        {selectedEskalasiId && (
          <EditEskalasiForm 
            id={selectedEskalasiId}
            initialData={selectedEskalasi}
            closeModal={closeEditModal} 
          />
        )}
      </Modal>
      
    </div>
  );
}