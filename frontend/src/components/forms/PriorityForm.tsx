"use client";
import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";

export default function AddKaryawanForm({ closeModal }: { closeModal: () => void}) {
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [unit_kerja, setunit_kerja] = useState("");
  const [job_title, setjob_title] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [is_active, setis_active] = useState<number | null>(null);
  const [id_priorities, setid_priorities] = useState(0);
  const [priorities, setPriorities] = useState<{ id: number; sla: string; level: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    
    e.preventDefault();
    setErrors({}); // Reset errors sebelum submit
  
    const formData = {
      nik: Number(nik),
      name,
      position,
      unit_kerja,
      job_title,
      role,
      password: role === "admin" ? password : undefined,
      is_active: is_active ? 1 : 0, // Kirim sebagai number 1 atau 0
      id_priorities: Number(id_priorities),
    };
  
    try {
      const response = await fetch("http://localhost:5000/karyawan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors); // Set error dari backend ke state errors
        }
        throw new Error(result.message || "Gagal menambahkan karyawan");
      }
  
      alert("Karyawan berhasil ditambahkan!");
      closeModal(); // 🔥 Tutup modal setelah sukses
    } catch (error: any) {
      console.error("❌ Error saat menambahkan karyawan:", error);
    }

  };
      
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await fetch("http://localhost:5000/priority");
        const data = await response.json();
        console.log("Fetched priorities:", data); // Debugging
  
        if (Array.isArray(data.data)) { // Ambil array dari properti data
          setPriorities(data.data);
        } else {
          console.error("Error: priorities is not an array", data);
          setPriorities([]); // Set default nilai array kosong agar tidak error
        }
      } catch (error) {
        console.error("Error fetching priorities:", error);
        setPriorities([]); // Hindari error dengan default array kosong
      }
    };
  
    fetchPriorities();
  }, []);
    
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Tambah Karyawan
      </h4>


      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <Label>NIK</Label>
          <Input
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder="NIK"
            className="w-full p-2 border rounded"
            type="text"
          />
        {errors.nik && <p className="text-red-500">{errors.nik}</p>}
        </div>

        <div className="col-span-1">
          <Label>Nama</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
            className="w-full p-2 border rounded"
            type="text"
          />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="col-span-1">
          <Label>Posisi</Label>
          <Input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Posisi"
            className="w-full p-2 border rounded"
            type="text"
          />
        {errors.position && <p className="text-red-500">{errors.position}</p>}
        </div>

        <div className="col-span-1">
          <Label>Unit Kerja</Label>
          <Input
            value={unit_kerja}
            onChange={(e) => setunit_kerja(e.target.value)}
            placeholder="Unit Kerja"
            className="w-full p-2 border rounded"
            type="text"
          />
        {errors.unit_kerja && <p className="text-red-500">{errors.unit_kerja}</p>}
        </div>

        <div className="col-span-1">
          <Label>Jabatan</Label>
          <Input
            value={job_title}
            onChange={(e) => setjob_title(e.target.value)}
            placeholder="Jabatan"
            className="w-full p-2 border rounded"
            type="text"
          />
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
            className="w-full p-2 border rounded bg-white"
            placeholder="Pilih Role yang Tepat"
          />
        {errors.role && <p className="text-red-500">{errors.role}</p>}
        </div>

        {role === "admin" && (
          <div className="col-span-1">
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full p-2 border rounded"
            />
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
            onChange={(value) => {
              console.log("Selected is_active:", value); // Debugging
              setis_active(Number(value));
            }}            
            className="w-full p-2 border rounded bg-white"
            placeholder="Pilih Status yang Tepat"
          />
        {errors.is_active && <p className="text-red-500">{errors.is_active}</p>}
        </div>

        <div className="col-span-1">
          <Label>ID Priorities</Label>
          <Select
            options={priorities.map((priority) => ({
              value: String(priority.id), // Convert id to string
              label: `${priority.sla} - ${priority.level}` // Combining sla and level for the label
            }))}
            onChange={(value) => setid_priorities(Number(value))}
            className="w-full p-2 border rounded bg-white"
            placeholder="Pilih Prioritas"
          />
        {errors.id_priorities && <p className="text-red-500">{errors.id_priorities}</p>}
        </div>
      </div>

      <div className="flex items-center justify-end w-full gap-3 mt-6">
        <Button size="sm" variant="outline">
          Simpan
        </Button>
      </div>
    </form>
  );
}
