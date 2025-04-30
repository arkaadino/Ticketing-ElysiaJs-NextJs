import { useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import usePriority from "@/hooks/usePriority";

export default function AddPriorityForm({ closeModal }: { closeModal: () => void }) {
  const { addPriority, loading: priorityLoading } = usePriority(); // 🔥 Menggunakan hook priority
  
  const [sla, setSla] = useState("");
  const [level, setLevel] = useState("");
  const [is_active, setIsActive] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔥 Tidak perlu lagi useEffect untuk fetch priorities karena sudah menggunakan hook

  // 🔥 Handle Submit tanpa parameter event
  const handleFormSubmit = async () => {
    setErrors({});

    const formData = {
      sla: Number(sla),
      level: Number(level),
      is_active: is_active ? 1 : 0,
    };

    const result = await addPriority(formData);
  
    if (result.success) {
      closeModal(); // 🔥 Tutup modal kalau sukses
    } else if (result.errors) {
      setErrors(result.errors); // Set errors dari server
    }
  };

  // Handle form submission dari event onSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };

  // Loading status dari kedua hook
  const loading = priorityLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Tambah Priorities
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">  
          <Input value={sla} onChange={(e) => setSla(e.target.value)} placeholder="SLA" type="number"/>
          {errors.sla && <p className="text-red-500">{errors.sla}</p>}
        </div>

        <div className="col-span-1">
          <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Level" type="number"/>
          {errors.level && <p className="text-red-500">{errors.level}</p>}
        </div>

        <div className="col-span-1">
          <Select
            options={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Tidak Aktif" },
            ]}
            onChange={(value) => setIsActive(Number(value))}
            placeholder="Pilih Status yang Tepat"
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