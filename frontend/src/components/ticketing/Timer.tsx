// components/ticketing/StatusCard.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";

interface StatusCardProps {
  ticketing: any;
  onStatusUpdate: (data: any) => Promise<void>;
}

const StatusCard: React.FC<StatusCardProps> = ({ ticketing, onStatusUpdate }) => {
    const router = useRouter();
  const [response, setResponse] = useState(ticketing?.response || "");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Format time as HH:MM:SS
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  // Konversi milisecond ke format Date untuk backend
  const millisecondsToDateFormat = (milliseconds: number) => {
    // Gunakan date-fns atau library lain jika perlu
    // Format: YYYY-MM-DD HH:MM:SS
    const date = new Date(milliseconds);
    return date.toISOString();
  };

  // Initialize timer based on ticketing data
  useEffect(() => {
    if (ticketing) {
      if (ticketing.mulai_pengerjaan && !ticketing.selesai_pengerjaan) {
        // Jika pekerjaan sudah dimulai tapi belum selesai
        const startTime = new Date(ticketing.mulai_pengerjaan).getTime();
        let elapsedTime = 0;
        
        if (ticketing.id_statuses === 2) { // Ongoing
          // Hitung waktu yang sudah berlalu dari waktu mulai hingga sekarang
          elapsedTime = Date.now() - startTime;
        } else if (ticketing.waktu_pengerjaan) {
          // Gunakan waktu yang tersimpan untuk status Pending
          // Konversi dari Date ke milliseconds
          const savedTime = new Date(ticketing.waktu_pengerjaan).getTime();
          elapsedTime = savedTime;
        }

        setTime(elapsedTime);
        pausedTimeRef.current = elapsedTime;
        
        // Jika status Ongoing, mulai timer otomatis
        if (ticketing.id_statuses === 2) {
          setIsRunning(true);
          startTimer(startTime);
        }
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [ticketing]);

  const startTimer = (startTimeValue?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Gunakan waktu mulai yang diberikan atau buat yang baru
    const start = startTimeValue || Date.now() - pausedTimeRef.current;
    startTimeRef.current = start;
    
    timerRef.current = setInterval(() => {
      const now = Date.now();
      setTime(now - start);
    }, 1000);
  };

  const handleStart = async () => {
    setIsRunning(true);
    const now = new Date();
    
    // Jika timer belum pernah dimulai sebelumnya
    if (!ticketing.mulai_pengerjaan) {
      // Update status backend menjadi Ongoing (id=2) dan set waktu mulai
      await onStatusUpdate({
        id_statuses: 2, // Ongoing
        mulai_pengerjaan: now.toISOString(),
      });
      
      // Mulai timer dari nol
      pausedTimeRef.current = 0;
      startTimer(now.getTime());
    } else {
      // Resume dari status pause - kembali ke Ongoing
      await onStatusUpdate({
        id_statuses: 2, // Ongoing
      });
      
      // Resume timer dari saat dijeda
      startTimer();
    }
  };

  const handlePause = async () => {
    setIsRunning(false);
    
    // Hentikan interval timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Simpan waktu yang sudah berlalu
    pausedTimeRef.current = time;
    
    // Update status backend menjadi Pending (id=4)
    // Konversi waktu ke format Date untuk backend
    const timeAsDate = new Date(time);
    
    await onStatusUpdate({
      id_statuses: 4, // Pending
      waktu_pengerjaan: timeAsDate.toISOString(), // Simpan waktu saat ini
      response: response, // Simpan response saat ini
    });
  };

  const handleComplete = async () => {
    setIsRunning(false);
    
    // Hentikan interval timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Konversi waktu ke format Date untuk backend
    const timeAsDate = new Date(time);
    
    // Update status backend menjadi Completed (id=1) dan set waktu selesai
    await onStatusUpdate({
      id_statuses: 1, // Completed
      selesai_pengerjaan: new Date().toISOString(),
      waktu_pengerjaan: timeAsDate.toISOString(), // Waktu akhir
      response: response, // Sertakan teks response saat ini
    });
  };


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Penanggung Jawab
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 bg-gray-50"
          value={ticketing?.Eskalasi?.name || ""}
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Response
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 h-32"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Masukkan respons penanganan tiket..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mulai Pengerjaan
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 bg-gray-50"
          value={
            ticketing?.mulai_pengerjaan
              ? new Date(ticketing.mulai_pengerjaan).toLocaleString()
              : "-"
          }
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Selesai Pengerjaan
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 bg-gray-50"
          value={
            ticketing?.selesai_pengerjaan
              ? new Date(ticketing.selesai_pengerjaan).toLocaleString()
              : "-"
          }
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Waktu Pengerjaan
        </label>
        <div className="text-2xl font-mono font-semibold text-center py-3 border border-gray-300 rounded bg-gray-50">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        {/* Tampilkan tombol yang sesuai berdasarkan status tiket dan keadaan timer */}
        {ticketing?.id_statuses !== 1 && (
          <>
            {!isRunning ? (
              <Button 
                onClick={handleStart} 
                className="w-full"
                variant="primary"
              >
                {ticketing?.mulai_pengerjaan ? "Lanjutkan" : "Mulai"}
              </Button>
            ) : (
              <Button 
                onClick={handlePause} 
                className="w-full"
                variant="outline"
              >
                Pause
              </Button>
            )}
            
            <Button 
              onClick={handleComplete} 
              className="w-full"
              variant="outline"
              disabled={ticketing?.mulai_pengerjaan === null}
            >
              Selesai
            </Button>
          </>
        )}
        
        {ticketing?.id_statuses === 1 && (
          <Button 
            className="w-full" 
            variant="outline" 
            disabled
          >
            Tiket Selesai
          </Button>
        )}

          <Button 
            className="w-full" 
            variant="primary" 
            onClick={() => router.back()}
          >
            Kembali
          </Button>

      </div>
    </div>
  );
};

export default StatusCard;