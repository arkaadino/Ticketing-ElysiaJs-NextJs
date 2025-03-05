import Swal from "sweetalert2";
import "@/styles/swal.css";

/**
 * Menampilkan alert dengan kustomisasi yang lebih clean
 * @param title - Judul alert
 * @param text - Isi pesan
 * @param icon - Jenis ikon (success, error, warning, info, question)
 */
export const showAlert = (title: string, text: string, icon: "success" | "error" | "warning" | "info" | "question") => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: "OK",
    confirmButtonColor: icon === "error" ? "#ac2f1d" : "#2c9830",
  });
};

/**
 * Menampilkan alert dengan konfirmasi (Yes/No)
 * @param title - Judul alert
 * @param text - Isi pesan
 * @returns Promise<boolean> - `true` jika user menekan Yes, `false` jika Cancel
 */
export const showConfirm = (title: string, text: string): Promise<boolean> => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    confirmButtonColor: "#2c9830",
    cancelButtonColor: "#ac2f1d",
  }).then((result) => result.isConfirmed);
};
