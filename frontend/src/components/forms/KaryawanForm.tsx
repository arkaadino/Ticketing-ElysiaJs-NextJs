import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddKaryawanForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: Record<string, any>) => {
    if (data.role === "employee") {
      delete data.password;
    }

    try {
      const response = await fetch("/master/karyawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Terjadi kesalahan saat menambahkan karyawan");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
        Tambah Karyawan
      </h4>

      {message && <p className="text-green-600">{message}</p>}

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            NIK
          </label>
          <input
            {...register("nik", { required: "NIK wajib diisi" })}
            placeholder="NIK"
            className="w-full p-2 border rounded"
          />
          {errors.nik && (
            <p className="text-red-500 text-sm">{errors.nik.message?.toString()}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            {...register("name", { required: "Nama wajib diisi" })}
            placeholder="Nama"
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message?.toString()}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Posisi
          </label>
          <input
            {...register("position", { required: "Posisi wajib diisi" })}
            placeholder="Posisi"
            className="w-full p-2 border rounded"
          />
          {errors.position && (
            <p className="text-red-500 text-sm">{errors.position.message?.toString()}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Unit Kerja
          </label>
          <input
            {...register("unit_kerja", { required: "Unit kerja wajib diisi" })}
            placeholder="Unit Kerja"
            className="w-full p-2 border rounded"
          />
          {errors.unit_kerja && (
            <p className="text-red-500 text-sm">{errors.unit_kerja.message?.toString()}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Jabatan
          </label>
          <input
            {...register("job_title", { required: "Jabatan wajib diisi" })}
            placeholder="Jabatan"
            className="w-full p-2 border rounded"
          />
          {errors.job_title && (
            <p className="text-red-500 text-sm">{errors.job_title.message?.toString()}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            {...register("role", { required: "Role wajib diisi" })}
            className="w-full p-2 border rounded bg-white"
          >
            <option value="">Pilih Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message?.toString()}</p>
          )}
        </div>

        {watch("role") === "admin" && (
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", { minLength: { value: 6, message: "Password minimal 6 karakter" } })}
              placeholder="Password"
              type="password"
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message?.toString()}</p>
            )}
          </div>
        )}

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Status Aktif
          </label>
          <input
            {...register("is_active", { required: "Status aktif wajib diisi" })}
            placeholder="Status Aktif"
            type="number"
            className="w-full p-2 border rounded"
          />
          {errors.is_active && (
            <p className="text-red-500 text-sm">{errors.is_active.message?.toString()}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            ID Priorities
          </label>
          <input
            {...register("id_priorities", { required: "ID Priorities wajib diisi" })}
            placeholder="ID Priorities"
            type="number"
            className="w-full p-2 border rounded"
          />
          {errors.id_priorities && (
            <p className="text-red-500 text-sm">{errors.id_priorities.message?.toString()}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end w-full gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}
