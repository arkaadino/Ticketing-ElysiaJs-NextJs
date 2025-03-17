import type { Metadata } from "next";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoryTable from "@/components/tables/CategoryTable";
import Button from "@/components/ui/button/Button";
import React from "react";

export const metadata: Metadata = {
  title:
    "LRS HelpDesk | Categories",
  description: "This is the Categories Page",
};

export default function CategoriesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Categories" />
      <div className="space-y-6">
        <ComponentCard title="Categories">
          <CategoryTable />
        </ComponentCard>
      </div>
    </div>
  );
}
