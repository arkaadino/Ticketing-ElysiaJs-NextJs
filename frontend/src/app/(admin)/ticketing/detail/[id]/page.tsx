// app/ticketing/detail/[id]/page.tsx
import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TicketingDetailClient from "@/components/ticketingdetail/TicketingDetailClient";

export const metadata: Metadata = {
  title: "LRS HelpDesk | Dashboard",
  description: "This is the Ticketing Detail Page",
};

export default function TicketingDetailPage() {
  return (
    <div >
      <PageBreadcrumb pageTitle="Ticketing Detail" />
      <TicketingDetailClient /> 
    </div>
  );
}
