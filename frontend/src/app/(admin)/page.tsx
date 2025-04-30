import type { Metadata } from "next";
import { Tasks } from "@/components/dashboard/Tasks";
import React from "react";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import MonthlySalesChart from "@/components/dashboard/MonthlyTicketing";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import DemographicCard from "@/components/dashboard/DemographicCard";

export const metadata: Metadata = {
  title:
    "LRS HelpDesk | Dashboard",
  description: "This is the Dashboard",
};


export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

      <div className="col-span-12 xl:col-span-12 ">
        <MonthlySalesChart />
      </div>


      <div className="col-span-12">
        <Tasks />
      </div>



      <div className="col-span-12 xl:col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
