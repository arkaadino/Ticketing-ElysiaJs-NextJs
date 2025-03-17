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
import EditKaryawanForm from "../forms/Karyawan/KaryawanEditForm";
import useKaryawan from "../../hooks/useKaryawan";
import AddKaryawanForm from "../forms/Karyawan/KaryawanForm";

export default function KaryawanTable() {
  const { karyawanList, deleteKaryawan, fetchKaryawan, selectKaryawan } = useKaryawan();
  const [selectedKaryawan, setSelectedKaryawan] = useState<any>(null);
  const [selectedKaryawanId, setSelectedKaryawanId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchKaryawan();
  }, [karyawanList]);

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedKaryawanId(null);
    setSelectedKaryawan(null);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleEditClick = async (id: string) => {
    try {
      const data = await selectKaryawan(id);
      if (data) {
        setSelectedKaryawan(data);
        setSelectedKaryawanId(id);
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Level</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {karyawanList.map((karyawan, index) => (
                <TableRow key={karyawan.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">{index + 1}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{karyawan.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{karyawan.nik}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{karyawan.position}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{karyawan.unit_kerja}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{karyawan.job_title}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{karyawan.role}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{karyawan.Priority?.level} {""} ({karyawan.Priority?.sla} Jam)</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={karyawan.is_active ? "success" : "error"}>
                      {karyawan.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        className="px-3 py-1 bg-warning-400 text-white rounded hover:bg-warning-500 transition"
                        onClick={() => handleEditClick(karyawan.id)}
                      >
                        Edit
                      </Button>                    
                      <Button 
                        size="sm"
                        className="px-3 py-1 bg-error-500 text-white rounded hover:bg-error-600 transition" 
                        onClick={() => deleteKaryawan(karyawan.id)}
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
        {selectedKaryawanId && (
          <EditKaryawanForm 
            id={selectedKaryawanId}
            initialData={selectedKaryawan}
            closeModal={closeEditModal} 
          />
        )}
      </Modal>
      
    </div>
  );
}