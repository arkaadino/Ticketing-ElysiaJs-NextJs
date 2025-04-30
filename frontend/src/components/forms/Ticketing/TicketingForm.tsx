import { useState } from "react";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";
import useTicketing from "@/hooks/useTicketing";
import useKaryawan from "@/hooks/useKaryawan";
import useCategories from "@/hooks/useCategories";
import useEskalasi from "@/hooks/useEskalasi";
import TextArea from "@/components/form/input/TextArea";
import SearchableSelect from "@/components/form/SearchableSelect";

export default function AddTicketingForm({ closeModal }: { closeModal: () => void }) {
  const { addTicketing, loading: ticketingLoading } = useTicketing();
  const { karyawanList, loading: karyawanLoading } = useKaryawan();
  const { categoriesList, loading: categoryLoading } = useCategories();
  const { eskalasiList, loading: eskalasiLoading } = useEskalasi();
  const [id_eskalasis, setIdEskalasis] = useState(0);
  const [id_categories, setIdCategories] = useState(0);
  const [id_priorities, setIdPriorities] = useState(0);
  const [id_karyawans, setIdKaryawans] = useState(0);
  const [id_statuses] = useState(3); // status "Open"
  const [keluhan, setKeluhan] = useState("");
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
      id_eskalasis: Number(id_eskalasis),
      id_statuses: Number(id_statuses || 3),
      keluhan,
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
  const loading = ticketingLoading || karyawanLoading || categoryLoading  || eskalasiLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Tambah Tiket
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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
            options={eskalasiList.map((e) => ({
              value: String(e.id),
              label: e.name,
            }))}
            onChange={(value) => setIdEskalasis(Number(value))}
            placeholder="Pilih Eskalasi"
          />
          {errors.id_eskalasis && <p className="text-red-500">{errors.id_eskalasis}</p>}
        </div>

        <div className="col-span-2">
          <SearchableSelect
            options={karyawanList.map((karyawan) => ({
              value: String(karyawan.id),
              label: karyawan.name,
            }))}
            onChange={(value) => setIdKaryawans(Number(value))}
            placeholder="Pilih Karyawan"
            className="w-full"
          />
          {errors.id_karyawans && <p className="text-red-500">{errors.id_karyawans}</p>}
        </div>

        <div className="col-span-2">
          <TextArea 
            value={keluhan} 
            onChange={setKeluhan} 
            placeholder="Keluhan"
          />
          {errors.keluhan && <p className="text-red-500">{errors.keluhan}</p>}
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
