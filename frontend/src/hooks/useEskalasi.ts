import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "../components/ui/swal/swal"; // Corrected import path
import { error } from "console";
import { fetchWithRefresh } from "@/utils/api";

export default function useEskalasi() {
  const [eskalasiList, setEskalasiList] = useState<any[]>([]);
  const [eskalasi, setEskalasi] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEskalasi(); // Fetch Eskalasi data on initial load
  }, []);

  // Fetch all active Eskalasi
  const fetchEskalasi = async () => {
    try {
      setLoading(true);

      const response = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/eskalasi`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        // Data ada
        setEskalasiList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        // Hanya munculkan alert kalau error-nya bukan "Data tidak ditemukan"
        showAlert("Error!", result.message, "error");
      } else {
        // Kalau memang kosong, set jadi array kosong tanpa alert
        setEskalasiList([]);
      }
    } catch (error) {
      console.error("Failed to fetch eskalasi:", error);
      console.error("Error details:", JSON.stringify(error));
      showAlert("Error!", "Failed to fetch eskalasi!", "error");
    } finally {
      setLoading(false);
    }
  };  
// Select a specific Eskalasi by ID
  const selectEskalasi = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setEskalasi(result.data || null);
        return result.data; // Return the data
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch eskalasi:", error);
      showAlert("Error!", "Failed to fetch Eskalasi!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

// 🔥 Tambah Eskalasi baru
  const addEskalasi = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi`, {
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

      showAlert("Berhasil!", "Eskalasi berhasil ditambahkan.", "success").then(() => {
        fetchEskalasi(); // Refresh data
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal menambahkan eskalasi:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false, errors: {} };
    }
  };
  // Update an existing Eskalasi
  const updateEskalasi = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi/${id}`, {
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

      showAlert("Success!", "Eskalasi data updated", "success").then(() => {
        fetchEskalasi();
      });

      return {success: true, errors: {}};
    } catch (error) {
      console.error("Failed to update eskalasi:", error);
      showAlert("Error!", "An error occurred, please try again!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Soft delete a Eskalasi
  const deleteEskalasi = async (id: string) => {
    const confirm = await showConfirm("Confirmation", "Are you sure you want to delete this Eskalasi?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/eskalasi/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) {
        showAlert("Failed!", result.message, "error");
        return false;
      }

      showAlert("Success!", "Eskalasi deleted", "success").then(() => {
        fetchEskalasi();
      });

      return true;
    } catch (error) {
      console.error("Failed to delete eskalasi:", error);
      showAlert("Error!", "An error occurred, please try again!", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { eskalasiList, eskalasi, loading, fetchEskalasi, addEskalasi, updateEskalasi, deleteEskalasi, selectEskalasi };
}
