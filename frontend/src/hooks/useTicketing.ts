import { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/components/ui/swal/swal";
import { fetchWithRefresh } from "@/utils/api";

export default function useTicketing() {
  const [ticketingList, setTicketingList] = useState<any[]>([]);
  const [ticketingHistoryList, setTicketingHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketing, setTicketing] = useState<any | null>(null);
  const [stats, setStats] = useState<{ completed: number; ongoing: number; open: number; pending: number; }>({
    completed: 0,
    ongoing: 0,
    open: 0,
    pending: 0,
  });
  // State untuk menyimpan data ticketing bulanan
  const [monthlyTicketingStats, setMonthlyTicketingStats] = useState<number[]>(
    Array(12).fill(0) // Inisialisasi array untuk 12 bulan dengan nilai 0
  );

  useEffect(() => {
    fetchTicketing(); 
    fetchStats(); // Ambil data ticketing saat pertama kali load
    fetchHistory();
    fetchMonthlyStats(); // Tambahkan fetch untuk data bulanan
  }, []);

  // Fetch semua ticketing yang ada
  const fetchTicketing = async () => {
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setTicketingList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        showAlert("Error!", result.message, "error");
      } else {
        setTicketingList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data ticketing:", error);
      showAlert("Error!", "Gagal mengambil data ticketing!", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectTicketing = useCallback(async (id: string): Promise<any | null> => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setTicketing(result.data || null);
        return result.data;
      } else {
        showAlert("Error!", result.message, "error");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch ticketing:", error);
      showAlert("Error!", "Failed to fetch ticketing!", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tambah ticketing baru
  const addTicketing = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings`, {
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

      showAlert("Berhasil!", "Ticketing berhasil ditambahkan.", "success").then(() => {
        fetchTicketing(); // Refresh data
        fetchMonthlyStats(); // Refresh data bulanan
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal menambahkan ticketing:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return { success: false };
    }
  };

  // Update ticketing
  const updateTicketing = async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/${id}`, {
        method: "PATCH",
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

      showAlert("Berhasil!", "Data ticketing diperbarui.", "success").then(() => {
        fetchTicketing();
        fetchMonthlyStats(); // Refresh data bulanan
      });

      return { success: true, errors: {} };
    } catch (error) {
      console.error("Gagal memperbarui ticketing:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // Soft delete ticketing
  const deleteTicketing = async (id: string) => {
    const confirm = await showConfirm("Konfirmasi", "Apakah Anda yakin ingin menghapus ticketing ini?");
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        showAlert("Gagal!", result.message, "error");
        return false;
      }

      showAlert("Berhasil!", "Ticketing telah dihapus.", "success").then(() => {
        fetchTicketing();
        fetchMonthlyStats(); // Refresh data bulanan
      });

      return true;
    } catch (error) {
      console.error("Gagal menghapus ticketing:", error);
      setLoading(false);
      showAlert("Error!", "Terjadi kesalahan, coba lagi!", "error");
      return false;
    }
  };

  // Ambil statistik ticketing
  const fetchStats = async () => {
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/stats`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result && result.completed !== undefined) {
        setStats(result);
      } else {
        showAlert("Error!", "Gagal mengambil statistik!", "error");
      }
    } catch (error) {
      console.error("Gagal mengambil stats:", error);
      showAlert("Error!", "Gagal mengambil statistik!", "error");
    }
  };

  // Ambil riwayat ticketing
  const fetchHistory = async () => {
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/history`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setTicketingHistoryList(result.data);
      } else if (result.message !== "Data tidak ditemukan") {
        showAlert("Error!", result.message, "error");
      } else {
        setTicketingHistoryList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data ticketing:", error);
      showAlert("Error!", "Gagal mengambil data ticketing!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi baru untuk mengambil statistik bulanan
  const fetchMonthlyStats = async () => {
    try {
      const response = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/ticketings/monthly`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        setMonthlyTicketingStats(result.data);
      } else {
        // Jika endpoint belum ada, kita bisa menghitung manual dari data ticketing
        calculateMonthlyStats();
      }
    } catch (error) {
      console.error("Gagal mengambil statistik bulanan:", error);
      // Jika endpoint belum ada, kita bisa coba hitung dari data ticketing
      calculateMonthlyStats();
    }
  };

  // Fungsi untuk menghitung statistik bulanan dari data ticketing yang sudah ada
  const calculateMonthlyStats = () => {
    // Inisialisasi array kosong untuk 12 bulan
    const monthlyData = Array(12).fill(0);
    
    // Hitung jumlah ticketing per bulan berdasarkan tanggal selesai
    ticketingList.forEach(ticket => {
      if (ticket.selesai_pengerjaan) {
        const completionDate = new Date(ticket.selesai_pengerjaan);
        const month = completionDate.getMonth(); // 0-11 for Jan-Dec
        monthlyData[month]++;
      }
    });
    
    setMonthlyTicketingStats(monthlyData);
  };

  return { 
    ticketingHistoryList, 
    ticketingList, 
    ticketing, 
    stats, 
    loading, 
    monthlyTicketingStats, // Ekspos data statistik bulanan
    fetchTicketing, 
    addTicketing, 
    updateTicketing, 
    deleteTicketing, 
    selectTicketing, 
    fetchStats, 
    fetchHistory,
    fetchMonthlyStats // Ekspos fungsi fetch data bulanan
  };
}