import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "../components/ui/swal/swal"; // Corrected import path
import { error } from "console";
import { fetchWithRefresh } from "@/utils/api";

export default function useKaryawan() {
  const [karyawanList, setKaryawanList] = useState<any[]>([]);
  const [karyawan, setKaryawan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKaryawan(); // Fetch karyawan data on initial load
  }, []);

  // Fetch all active karyawan
// Wrap fetchKaryawan with useCallback
const fetchKaryawan = useCallback(async () => {
  setLoading(true);
  try {
    const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();
    if (result.success) {
      setKaryawanList(result.data);
    } else {
      showAlert("Error!", result.message, "error");
    }
  } catch (error) {
    console.error("Failed to fetch karyawan:", error);
    console.error("Error details:", JSON.stringify(error));
    showAlert("Error!", "Failed to fetch karyawan!", "error");
  } finally {
    setLoading(false);
  }
}, []); // Empty dependency array as this doesn't depend on any props or state
  // Select a specific karyawan by ID
  const selectKaryawan = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setKaryawan(result.data || null);
        return result.data; // Return the data
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch karyawan:", error);
      showAlert("Error!", "Failed to fetch karyawan!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

// 🔥 Tambah karyawan baru
  const addKaryawan = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        if (result.errors) {
          return { success: false, errors: result.errors };
        }
        
        showAlert("Gagal!", result.message, "error");
        return { success: false, errors: {} };
      }

      showAlert("Berhasil!", "Karyawan berhasil ditambahkan.", "success").then(() => {
        fetchKaryawan(); // Refresh data
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal menambahkan karyawan:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    }
  };
  // Update an existing karyawan
  const updateKaryawan = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {

        if (result.errors) {
          return {success: false, errors: result.errors};
        }

        showAlert("Failed!", result.message, "error");
        return {success: false, errors: {}};
      }

      showAlert("Success!", "Karyawan data updated", "success").then(() => {
        fetchKaryawan();
      });

      return {success: true, errors: {}};
    } catch (error) {
      console.error("Failed to update karyawan:", error);
      showAlert("Error!", "An error occurred, please try again!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Soft delete a karyawan
  const deleteKaryawan = async (id: string) => {
    const confirm = await showConfirm("Confirmation", "Are you sure you want to delete this karyawan?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/karyawan/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        showAlert("Failed!", result.message, "error");
        return false;
      }

      showAlert("Success!", "Karyawan deleted", "success").then(() => {
        fetchKaryawan();
      });

      return true;
    } catch (error) {
      console.error("Failed to delete karyawan:", error);
      showAlert("Error!", "An error occurred, please try again!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { karyawanList, karyawan, loading, fetchKaryawan, addKaryawan, updateKaryawan, deleteKaryawan, selectKaryawan };
}
