import { useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import useKaryawan from "@/hooks/useKaryawan";
import usePriority from "@/hooks/usePriority";

export default function AddKaryawanForm({ closeModal }: { closeModal: () => void }) {
  const { addKaryawan, loading: karyawanLoading } = useKaryawan();
  const { PriorityList, loading: priorityLoading } = usePriority(); // 🔥 Menggunakan hook priority
  
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [unit_kerja, setUnitKerja] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [is_active, setIsActive] = useState<number | null>(null);
  const [id_priorities, setIdPriorities] = useState(0);
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
      password: role === "admin" ? password : undefined,
      is_active: is_active ? 1 : 0,
      id_priorities: Number(id_priorities),
    };

    const success = await addKaryawan(formData);
    if (success) closeModal(); // 🔥 Tutup modal kalau sukses
  };

  // Handle form submission dari event onSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };

  // Loading status dari kedua hook
  const loading = karyawanLoading || priorityLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Tambah Karyawan
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <Label>NIK</Label>
          <Input value={nik} onChange={(e) => setNik(e.target.value)} placeholder="NIK" />
          {errors.nik && <p className="text-red-500">{errors.nik}</p>}
        </div>

        <div className="col-span-1">
          <Label>Nama</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="col-span-1">
          <Label>Posisi</Label>
          <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Posisi" />
          {errors.position && <p className="text-red-500">{errors.position}</p>}
        </div>

        <div className="col-span-1">
          <Label>Unit Kerja</Label>
          <Input value={unit_kerja} onChange={(e) => setUnitKerja(e.target.value)} placeholder="Unit Kerja" />
          {errors.unit_kerja && <p className="text-red-500">{errors.unit_kerja}</p>}
        </div>

        <div className="col-span-1">
          <Label>Jabatan</Label>
          <Input value={job_title} onChange={(e) => setJobTitle(e.target.value)} placeholder="Jabatan" />
          {errors.job_title && <p className="text-red-500">{errors.job_title}</p>}
        </div>

        <div className="col-span-1">
          <Label>Role</Label>
          <Select
            options={[
              { value: "admin", label: "Admin" },
              { value: "employee", label: "Employee" },
            ]}
            onChange={(value) => setRole(value)}
            placeholder="Pilih Role yang Tepat"
          />
          {errors.role && <p className="text-red-500">{errors.role}</p>}
        </div>

        {role === "admin" && (
          <div className="col-span-1">
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
        )}

        <div className="col-span-1">
          <Label>Status Aktif</Label>
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

        <div className="col-span-1">
          <Label>ID Priorities</Label>
          <Select
            options={PriorityList.map((priority) => ({
              value: String(priority.id),
              label: `${priority.sla} - ${priority.level}`,
            }))}
            onChange={(value) => setIdPriorities(Number(value))}
            placeholder="Pilih Prioritas"
          />
          {errors.id_priorities && <p className="text-red-500">{errors.id_priorities}</p>}
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