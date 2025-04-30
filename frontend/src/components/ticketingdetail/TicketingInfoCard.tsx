import React from "react";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";

interface TicketingInfoCardProps {
  ticketing: any;
}

const TicketingInfoCard: React.FC<TicketingInfoCardProps> = ({ ticketing }) => {
  if (!ticketing) {
    return <div>Data tiket tidak tersedia</div>;
  }

  return (
    <div className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          ID Ticket
        </label>
        <Input
          value={ticketing.id || ""}
          readOnly={true}
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Karyawan
        </label>
        <Input
          value={ticketing.Karyawan?.name || ""}
          readOnly={true}  // Menampilkan data tapi tidak bisa diedit
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Position
        </label>
        <Input
          value={ticketing.Karyawan?.position || ""}
          readOnly={true}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <Input
          value={ticketing.Category?.name || ""}
          readOnly={true}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Keluhan
        </label>
        <TextArea 
          value={ticketing.keluhan || ""}
          readOnly={true}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tanggal Keluhan
        </label>
        <Input
          value={ticketing.tanggal_keluhan ? new Date(ticketing.tanggal_keluhan).toLocaleString() : ""}
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default TicketingInfoCard;
