import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/TicketingTable";

import React from "react";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Status" />
      <div className="space-y-6">
        <ComponentCard title="Data Karyawan">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
