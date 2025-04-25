import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useCategories() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any | null>(null);


  useEffect(() => {
    fetchCategories(); // 🔥 Ambil data categories saat pertama kali load
  }, []);

  // 🔥 Fetch semua Categories yang aktif
  const fetchCategories = async () => {
    try {
      setLoading(true);
  
      const response = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "GET",
          credentials: "include",
        }
      );
  
      const result = await response.json();
  
      if (result.success) {
        // Data ada
        setCategoriesList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        // Hanya munculkan alert kalau error-nya bukan "Data tidak ditemukan"
        showAlert("Error!", result.message, "error");
      } else {
        // Kalau memang kosong, set jadi array kosong tanpa alert
        setCategoriesList([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      console.error("Error details:", JSON.stringify(error));
      showAlert("Error!", "Failed to fetch categories!", "error");
    } finally {
      setLoading(false);
    }
  };

    const selectCategories = useCallback(async (id: string): Promise<any | null> => {
      setLoading(true);
      try {
        const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
          method: "GET",
          credentials: "include",
        });
  
        const result = await response.json();
        if (result.success) {
          setCategories(result.data || null);
          return result.data; // Return the data
        } else {
          showAlert("Error!", result.message, "error");
          return null;
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        showAlert("Error!", "Failed to fetch categories!", "error");
        return null;
      } finally {
        setLoading(false);
      }
    }, []);
  
    
// 🔥 Tambah categories baru
const addCategories = async (data: any) => {
  setLoading(true);
  try {
    const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      // Jika ada error validasi dari server, kembalikan ke form untuk ditampilkan
      if (result.errors) {
        return { success: false, errors: result.errors };
      }
      
      // Jika error lain (bukan validasi), tampilkan Swal
      showAlert("Gagal!", result.message, "error");
      return { success: false, errors: {}};
    }

    showAlert("Berhasil!", "categories berhasil ditambahkan.", "success").then(() => {
      fetchCategories(); // Refresh data
    });

    return { success: true, errors: {}};
  } catch (error) {
    console.error("Gagal menambahkan categories:", error);
    setLoading(false);
    showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
    return { success: false };
  }
};
  // 🔥 Update categories
  const updateCategories = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        // Jika ada error validasi dari server, kembalikan ke form untuk ditampilkan
        if (result.errors) {
          return { success: false, errors: result.errors };
        }
        
        // Jika error lain (bukan validasi), tampilkan Swal
        showAlert("Gagal!", result.message, "error");
        return { success: false, errors: {}};
      }
  
      showAlert("Berhasil!", "data categories diperbarui.", "success").then(() => {
        fetchCategories();
      });

      return {success: true, errors: {}};
    } catch (error) {
      console.error("Gagal memperbarui categories:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // 🔥 Soft delete categories
  const deleteCategories = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus categories ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Categories telah dihapus.", "success").then(() => {
        fetchCategories();
      });

      return true;
    } catch (error) {
      console.error("Gagal menghapus categories:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  return { categoriesList, categories, loading, fetchCategories, addCategories, updateCategories, deleteCategories, selectCategories };
}
