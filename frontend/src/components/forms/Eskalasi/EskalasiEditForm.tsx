import { useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import useEskalasi from "@/hooks/useEskalasi";

interface EskalasiEditFormProps {
  id: string;
  initialData: any;
  closeModal: () => void;
}

export default function EditEskalasiForm({ id, initialData, closeModal }: EskalasiEditFormProps) {
  const { updateEskalasi, loading: eskalasiLoading } = useEskalasi();
  
  const [nik, setNik] = useState(initialData?.nik?.toString() || "");
  const [name, setName] = useState(initialData?.name || "");
  const [position, setPosition] = useState(initialData?.position || "");
  const [unit_kerja, setUnitKerja] = useState(initialData?.unit_kerja ||"");
  const [job_title, setJobTitle] = useState(initialData?.job_title ||"");
  const [role, setRole] = useState(initialData?.role ||"");
  const [password, setPassword] = useState("");
  const [is_active, setIsActive] = useState<number | null>((initialData?.is_active ? 1 : 0));
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

    const success = await updateEskalasi(id, formData);
    if (success) closeModal();
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
        Edit Eskalasi
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <Input 
          value={nik} 
          onChange={(e) => setNik(e.target.value)} 
          placeholder="NIK"
          hint={`Original: ${initialData?.nik || 'None'}`}
          />
          {errors.nik && <p className="text-red-500">{errors.nik}</p>}
        </div>

        <div className="col-span-1">
          <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nama" 
          hint={`Original: ${initialData?.name || 'None'}`}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="col-span-1">
          <Input 
          value={position} 
          onChange={(e) => setPosition(e.target.value)} 
          placeholder="Posisi" 
          hint={`Original: ${initialData?.position || 'None'}`}
          />
          {errors.position && <p className="text-red-500">{errors.position}</p>}
        </div>

        <div className="col-span-1">
          <Input 
          value={unit_kerja} 
          onChange={(e) => setUnitKerja(e.target.value)} 
          placeholder="Unit Kerja" 
          hint={`Original: ${initialData?.unit_kerja || 'None'}`}
          />
          {errors.unit_kerja && <p className="text-red-500">{errors.unit_kerja}</p>}
        </div>

        <div className="col-span-1">
          <Input 
          value={job_title} 
          onChange={(e) => setJobTitle(e.target.value)} 
          placeholder="Jabatan" 
          hint={`Original: ${initialData?.job_title || 'None'}`}
          />
          {errors.job_title && <p className="text-red-500">{errors.job_title}</p>}
        </div>

          <div className="col-span-1">
            <Input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password Baru" 
            type="password" 
            />
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
            defaultValue={is_active?.toString()}
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
              {loading ? "Menyimpan..." : "Perbarui"}
            </Button>
          </div>
    </form>
  );
}