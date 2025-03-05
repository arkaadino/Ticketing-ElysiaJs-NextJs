import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PriorityTable from "@/components/tables/PriorityTable";
import React from "react";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Prioritas" />
      <div className="space-y-6">
        <ComponentCard title="Data Prioritas">
          <PriorityTable />
        </ComponentCard>
      </div>
    </div>
  );
}
