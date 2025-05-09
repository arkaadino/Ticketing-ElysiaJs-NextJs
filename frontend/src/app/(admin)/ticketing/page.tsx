import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TicketingTable from "@/components/tables/TicketingTable";
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
      <PageBreadcrumb pageTitle="Ticketing" />
      <div className="space-y-6">
        <ComponentCard title="Ticketing">
          <TicketingTable />
        </ComponentCard>
      </div>
    </div>
  );
}
