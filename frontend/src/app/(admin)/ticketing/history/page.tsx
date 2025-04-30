import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TicketingHistoryTable from "@/components/tables/TicketingHistoryTable";
import { Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title:
    "LRS HelpDesk | Dashboard",
  description: "This is the Ticketing Page",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="History Ticketing" />
      <div className="space-y-6">
        <ComponentCard title="History Ticketing ">
          <TicketingHistoryTable />
        </ComponentCard>
      </div>
    </div>
  );
}
