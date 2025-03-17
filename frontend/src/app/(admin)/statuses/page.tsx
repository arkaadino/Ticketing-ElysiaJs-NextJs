import type { Metadata } from "next";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StatusesTable from "@/components/tables/StatusTable";
import Button from "@/components/ui/button/Button";
import React from "react";

export const metadata: Metadata = {
  title:
    "LRS HelpDesk | Statuses",
  description: "This is the Statuses Page",
};

export default function StatusesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Statuses" />
      <div className="space-y-6">
        <ComponentCard title="Statuses">
          <StatusesTable />
        </ComponentCard>
      </div>
    </div>
  );
}
