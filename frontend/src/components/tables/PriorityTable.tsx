"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import usePriority from "@/hooks/usePriority";
import { Modal } from "../ui/modal";
import EditPriorityForm from "../forms/Priority/PriorityEditForm";

export default function PriorityTable() {
  const { priorityList, deletePriority, selectPriority, fetchPriority } = usePriority();
  const [selectedPriority, setSelectedPriority] = useState<any>(null);
  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  
  useEffect (() => {
    fetchPriority();
  }, [priorityList]);

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedPriority(null);
    setSelectedPriorityId(null);
  };  

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleEditClick = async (id: string) => {
    try {
      const data = await selectPriority(id);

      if (data) {
        setSelectedPriority(data);
        setSelectedPriorityId(id);
        setEditModalOpen(true);
      }
    } catch (error) {
      console.error("Gagal mengambil data :", error)
    }
  }

  return (
    <div className="overflow-hidden">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Service Level Agreement</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Level</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 flex space-x-2">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {priorityList.map((priority, index)=> (
                <TableRow key={priority.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">{index + 1}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{priority.sla} Jam</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{priority.level}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={priority.is_active ? "success" : "error"}>{priority.is_active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex space-x-2">
                    <Button 
                      size="sm"
                      className="px-3 py-1 bg-warning-400 text-white rounded hover:bg-warning-500 transition"
                      onClick={() => handleEditClick(priority.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" 
                      onClick={() => 
                      deletePriority(priority.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

            <Modal isOpen={isEditModalOpen} onClose={closeEditModal} className="max-w-[584px] p-5 lg:p-10">
              {selectedPriorityId && (
                <EditPriorityForm 
                  id={selectedPriorityId}
                  initialData={selectedPriority}
                  closeModal={closeEditModal} 
                />
              )}
            </Modal>
      

    </div>
  );
}
