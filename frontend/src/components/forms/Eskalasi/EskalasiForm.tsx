import { useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import useEskalasi from "@/hooks/useEskalasi";

export default function AddEskalasiForm({ closeModal }: { closeModal: () => void }) {
  const { addEskalasi, loading: eskalasiLoading } = useEskalasi();
  
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [unit_kerja, setUnitKerja] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [is_active, setIsActive] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔥 Tidak perlu lagi useEffect untuk fetch priorities karena sudah menggunakan hook

  // 🔥 Handle Submit tanpa parameter event
  const handleFormSubmit = async () => {
    setErrors({});

    const formData = {
      nik: Number(nik),
      name,
      position,
      unit_kerja,
      job_title,
      role,
      password,
      is_active: is_active ? 1 : 0,
    };

    const result = await addEskalasi(formData);
  
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
  const loading = eskalasiLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Tambah Eskalasi
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <Input value={nik} onChange={(e) => setNik(e.target.value)} placeholder="NIK" type="number"/>
          {errors.nik && <p className="text-red-500">{errors.nik}</p>}
        </div>

        <div className="col-span-1">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="col-span-1">
          <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" />
          {errors.position && <p className="text-red-500">{errors.position}</p>}
        </div>

        <div className="col-span-1">
          <Input value={unit_kerja} onChange={(e) => setUnitKerja(e.target.value)} placeholder="Unit Kerja" />
          {errors.unit_kerja && <p className="text-red-500">{errors.unit_kerja}</p>}
        </div>

        <div className="col-span-1">
          <Input value={job_title} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job Title" />
          {errors.job_title && <p className="text-red-500">{errors.job_title}</p>}
        </div>

          <div className="col-span-1">
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
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
              onClick={closeModal}
              className="bg-gray-200 text-gray-800"
            >
              Batal
            </Button>
            <Button 
              size="sm" 
              variant="primary"
              onClick={handleFormSubmit}
              disabled={loading}
              className="bg-primary-500 text-white"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
    </form>
  );
}