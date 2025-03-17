import type { Metadata } from "next";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PriorityTable from "@/components/tables/PriorityTable";
import Button from "@/components/ui/button/Button";
import React from "react";

export const metadata: Metadata = {
  title:
    "LRS HelpDesk | Priorities",
  description: "This is the Priorities Page",
};

export default function PrioritiesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Priorities" />
      <div className="space-y-6">
        <ComponentCard title="Priorities">
          <PriorityTable />
        </ComponentCard>
      </div>
    </div>
  );
}
