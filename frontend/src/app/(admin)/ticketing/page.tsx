import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TicketingTable from "@/components/tables/TicketingTable";

import React from "react";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ticketing" />
      <div className="space-y-6">
        <ComponentCard title="Data Ticketing">
          <TicketingTable />
        </ComponentCard>
      </div>
    </div>
  );
}
