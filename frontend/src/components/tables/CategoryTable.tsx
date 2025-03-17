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
import { Modal } from "../ui/modal";
import EditCategoriesForm from "../forms/Categories/CategoriesEditForm";
import useCategories from "@/hooks/useCategories";

export default function categoriesTable() {
  const { categoriesList, deleteCategories, selectCategories, fetchCategories } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<any>(null);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  
  useEffect (() => {
    fetchCategories();
  }, [categoriesList]);

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedCategories(null);
    setSelectedCategoriesId(null);
  };  

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleEditClick = async (id: string) => {
    try {
      const data = await selectCategories(id);

      if (data) {
        setSelectedCategories(data);
        setSelectedCategoriesId(id);
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 flex space-x-2">Aksi</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {categoriesList.map((categories, index)=> (
                <TableRow key={categories.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">{index + 1}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{categories.name}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={categories.is_active ? "success" : "error"}>{categories.is_active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex space-x-2">
                    <Button 
                      size="sm"
                      className="px-3 py-1 bg-warning-400 text-white rounded hover:bg-warning-500 transition"
                      onClick={() => handleEditClick(categories.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" 
                      onClick={() => 
                      deleteCategories(categories.id)}
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
              {selectedCategoriesId && (
                <EditCategoriesForm 
                  id={selectedCategoriesId}
                  initialData={selectedCategories}
                  closeModal={closeEditModal} 
                />
              )}
            </Modal>
      

    </div>
  );
}
