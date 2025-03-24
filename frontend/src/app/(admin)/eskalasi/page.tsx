import type { Metadata } from "next";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import EskalasiTable from "@/components/tables/EskalasiTable";

export const metadata: Metadata = {
  title:
    "LRS HelpDesk | Eskalasi",
  description: "This is the Eskalasi Page",
};

export default function EskalasiPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Eskalasi" />
      <div className="space-y-6">
        <ComponentCard title="Eskalasi">
          <EskalasiTable />
        </ComponentCard>
      </div>
    </div>
  );
}
