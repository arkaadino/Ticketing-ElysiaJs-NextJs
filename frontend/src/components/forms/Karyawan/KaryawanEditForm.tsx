import { useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import useKaryawan from "../../../hooks/useKaryawan";
import usePriority from "../../../hooks/usePriority";

interface KaryawanEditFormProps {
  id: string;
  initialData: any;
  closeModal: () => void;
}

export default function EditKaryawanForm({ id, initialData, closeModal }: KaryawanEditFormProps) {
  const { updateKaryawan, loading: karyawanLoading } = useKaryawan();
  const { priorityList, loading: priorityLoading } = usePriority();
  
  // Form state initialized with initialData
  const [nik, setNik] = useState(initialData?.nik?.toString() || "");
  const [name, setName] = useState(initialData?.name || "");
  const [position, setPosition] = useState(initialData?.position || "");
  const [unit_kerja, setUnitKerja] = useState(initialData?.unit_kerja || "");
  const [job_title, setJobTitle] = useState(initialData?.job_title || "");
  const [password, setPassword] = useState(""); // Password is always empty initially
  const [is_active, setIsActive] = useState<number | null>(initialData?.is_active ? 1 : 0);
  const [id_priorities, setIdPriorities] = useState(initialData?.id_priorities || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form submission
  const handleFormSubmit = async () => {
    setErrors({});

    const formData: any = {
      nik: Number(nik),
      name,
      position,
      unit_kerja,
      job_title,
      is_active: is_active ? 1 : 0,
      id_priorities: Number(id_priorities),
    };

    // Only include password if it has been provided
    const success = await updateKaryawan(id, formData);
    if (success) closeModal();
  };

  // Handle form submission from event onSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };

  // Loading status combining all loading states
  const loading = karyawanLoading || priorityLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Edit Karyawan
      </h4>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Input 
                value={nik} 
                onChange={(e) => setNik(e.target.value)} 
                placeholder="NIK" 
                hint={`Original: ${initialData?.nik || 'None'}`}
                type="number"
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
              <Select
                options={[
                  { value: 1, label: "Aktif" },
                  { value: 0, label: "Tidak Aktif" },
                ]}
                onChange={(value) => setIsActive(Number(value))}
                placeholder="Pilih Status yang Tepat"
                defaultValue={is_active?.toString()}
              />
              {errors.is_active && <p className="text-red-500">{errors.is_active}</p>}
            </div>

            <div className="col-span-1">
              <Select
                options={priorityList.map((priority) => ({
                  value: String(priority.id),
                  label: `${priority.sla} - ${priority.level}`,
                }))}
                onChange={(value) => setIdPriorities(Number(value))}
                placeholder="Pilih Prioritas"
                defaultValue={id_priorities?.toString()}
              />
              {errors.id_priorities && <p className="text-red-500">{errors.id_priorities}</p>}
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
        </>
      )}
    </form>
  );
}