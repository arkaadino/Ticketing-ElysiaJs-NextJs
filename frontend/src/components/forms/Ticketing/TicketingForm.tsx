import { useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import useTicketing from "@/hooks/useTicketing";
import useKaryawan from "@/hooks/useKaryawan";
import useCategories from "@/hooks/useCategories";
import usePriority from "@/hooks/usePriority";
import useStatuses from "@/hooks/useStatuses";

export default function AddTicketingForm({ closeModal }: { closeModal: () => void }) {
  const { addTicketing, loading: ticketingLoading } = useTicketing();
  const { karyawanList, loading: karyawanLoading } = useKaryawan();
  const { categoriesList, loading: categoryLoading } = useCategories();
  const { priorityList, loading: priorityLoading } = usePriority();
  const { statusesList, loading: statusLoading } = useStatuses();
  
  const [id_karyawans, setIdKaryawans] = useState(0);
  const [id_categories, setIdCategories] = useState(0);
  const [id_priorities, setIdPriorities] = useState(0);
  const [id_statuses, setIdStatuses] = useState(0);
  const [keluhan, setKeluhan] = useState("");
  const [eskalasi, setEskalasi] = useState("");
  const [response, setResponse] = useState("");
  const [analisa, setAnalisa] = useState("");
  const [is_active, setIsActive] = useState<number | null>(1); // Default to active
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFormSubmit = async () => {
    setErrors({});

    const formData = {
      id_karyawans: Number(id_karyawans),
      id_categories: Number(id_categories),
      id_priorities: Number(id_priorities),
      id_statuses: Number(id_statuses),
      keluhan,
      eskalasi,
      response,
      analisa,
      is_active: is_active ? 1 : 0,
    };

    const result = await addTicketing(formData);
  
    if (result.success) {
      closeModal(); // Tutup modal kalau sukses
    } else if (result.errors) {
      setErrors(result.errors); // Set errors dari server
    }
  };

  // Handle form submission dari event onSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };

  // Loading status dari semua hook
  const loading = ticketingLoading || karyawanLoading || categoryLoading || priorityLoading || statusLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Tambah Tiket
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <Select
            options={karyawanList.map((karyawan) => ({
              value: String(karyawan.id),
              label: karyawan.name,
            }))}
            onChange={(value) => setIdKaryawans(Number(value))}
            placeholder="Pilih Karyawan"
          />
          {errors.id_karyawans && <p className="text-red-500">{errors.id_karyawans}</p>}
        </div>

        <div className="col-span-1">
          <Select
            options={categoriesList.map((categories) => ({
              value: String(categories.id),
              label: categories.name,
            }))}
            onChange={(value) => setIdCategories(Number(value))}
            placeholder="Pilih Kategori"
          />
          {errors.id_categories && <p className="text-red-500">{errors.id_categories}</p>}
        </div>

        <div className="col-span-1">
          <Select
            options={priorityList.map((priority) => ({
              value: String(priority.id),
              label: `${priority.sla} - ${priority.level}`,
            }))}
            onChange={(value) => setIdPriorities(Number(value))}
            placeholder="Pilih Prioritas"
          />
          {errors.id_priorities && <p className="text-red-500">{errors.id_priorities}</p>}
        </div>

        <div className="col-span-1">
          <Select
            options={statusesList.map((statuses) => ({
              value: String(statuses.id),
              label: statuses.name,
            }))}
            onChange={(value) => setIdStatuses(Number(value))}
            placeholder="Pilih Status"
          />
          {errors.id_statuses && <p className="text-red-500">{errors.id_statuses}</p>}
        </div>

        <div className="col-span-2">
          <Input 
            value={keluhan} 
            onChange={(e) => setKeluhan(e.target.value)} 
            placeholder="Keluhan"
          />
          {errors.keluhan && <p className="text-red-500">{errors.keluhan}</p>}
        </div>

        <div className="col-span-2">
          <Input 
            value={eskalasi} 
            onChange={(e) => setEskalasi(e.target.value)} 
            placeholder="Eskalasi"
          />
          {errors.eskalasi && <p className="text-red-500">{errors.eskalasi}</p>}
        </div>

        <div className="col-span-2">
          <Input 
            value={response} 
            onChange={(e) => setResponse(e.target.value)} 
            placeholder="Response"
          />
          {errors.response && <p className="text-red-500">{errors.response}</p>}
        </div>

        <div className="col-span-2">
          <Input 
            value={analisa} 
            onChange={(e) => setAnalisa(e.target.value)} 
            placeholder="Analisa"
          />
          {errors.analisa && <p className="text-red-500">{errors.analisa}</p>}
        </div>

        <div className="col-span-1">
          <Select
            options={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Tidak Aktif" },
            ]}
            onChange={(value) => setIsActive(Number(value))}
            placeholder="Pilih Status Tiket"
          />
          {errors.is_active && <p className="text-red-500">{errors.is_active}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end w-full gap-3 mt-6">
        <Button 
          size="sm" 
          variant="outline" 
          disabled={loading}
          onClick={handleFormSubmit}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}