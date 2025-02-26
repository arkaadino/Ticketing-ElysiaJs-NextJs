"use client";
import React from "react";
import Button from "../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";

// Import modal form yang sesuai
import TicketingForm from "../forms/TicketingForm";
import KaryawanForm from "../forms/KaryawanForm";
import StatusesForm from "../forms/StatusesForm";
import CategoriesForm from "../forms/CategoriesForm";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => { console.log("ComponentCard title:", title);

  const { isOpen, openModal, closeModal } = useModal();

  // Daftar halaman yang boleh menampilkan tombol
  const allowedPages = [
    "ticketing",
    "karyawan",
    "karyawan/eskalasi",
    "karyawan/priorities",
    "statuses",
    "categories",
  ];

  // Fungsi untuk menentukan apakah tombol harus ditampilkan
  const isPageAllowed = allowedPages.includes(title.toLowerCase());

  // Fungsi untuk menentukan form yang sesuai dengan halaman
  const getFormComponent = () => {
    switch (title.toLowerCase()) {
      case "ticketings":
        return <TicketingForm />;
      case "karyawan":
      case "karyawan/eskalasi":
      case "karyawan/priorities":
        return <KaryawanForm />;
      case "statuses":
        return <StatusesForm />;
      case "categories":
        return <CategoriesForm />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {isPageAllowed && (
          <Button variant="outline" size="sm" className="mt-2" onClick={openModal}>
            Tambah Data
          </Button>
        )}
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

      {/* Modal yang dipanggil dari file berbeda */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        {getFormComponent()}
      </Modal>
    </div>
  );
};


export default ComponentCard;
