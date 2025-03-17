import type { Metadata } from "next";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KaryawanTable from "@/components/tables/KaryawanTable";
import Button from "@/components/ui/button/Button";
import React from "react";

export const metadata: Metadata = {
  title:
    "LRS HelpDesk | Karyawan",
  description: "This is the Karyawan Page",
};

export default function KaryawanPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Karyawan" />
      <div className="space-y-6">
        <ComponentCard title="Karyawan">
          <KaryawanTable />
        </ComponentCard>
      </div>
    </div>
  );
}
