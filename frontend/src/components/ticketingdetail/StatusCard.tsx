"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";

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
  
  // Track accumulated time
  const accumulatedTimeRef = useRef<number>(0);
  // Track when the timer was last started
  const lastStartTimeRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (ticketing?.response) {
      setResponse(ticketing.response);
    }
  }, [ticketing?.response]);
  
  useEffect(() => {
    if (ticketing) {
      // If ticket is not active or status is completed
      if (ticketing.is_active === 0 || ticketing.id_statuses === 1) {
        setIsRunning(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Set the time from the stored waktu_pengerjaan if available
        if (ticketing.waktu_pengerjaan) {
          const storedTime = new Date(ticketing.waktu_pengerjaan).getTime();
          setTime(storedTime);
          accumulatedTimeRef.current = storedTime;
        }
        
        return;
      }
  
      if (ticketing.mulai_pengerjaan) {
        let elapsedTime = 0;
  
        // Calculate initial time based on ticket status
        if (ticketing.id_statuses === 4) {  // Status 4 is Ongoing
          // For active tickets, calculate from start time
          if (ticketing.waktu_pengerjaan) {
            // If there is already recorded time, use that as base
            elapsedTime = new Date(ticketing.waktu_pengerjaan).getTime();
            accumulatedTimeRef.current = elapsedTime;
            
            // Set last start time to now
            lastStartTimeRef.current = Date.now();
          } else {
            // Calculate from original start time
            const startTime = new Date(ticketing.mulai_pengerjaan).getTime();
            elapsedTime = Date.now() - startTime;
            accumulatedTimeRef.current = 0;
            lastStartTimeRef.current = startTime;
          }
          
          setIsRunning(true);
          startTimer();
        } else if (ticketing.id_statuses === 2) {  // Status 2 is Pending
          // For paused tickets, use stored elapsed time
          if (ticketing.waktu_pengerjaan) {
            elapsedTime = new Date(ticketing.waktu_pengerjaan).getTime();
            accumulatedTimeRef.current = elapsedTime;
          }
          lastStartTimeRef.current = null;
          setIsRunning(false);
        }
  
        setTime(elapsedTime);
      }
    }
  
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [ticketing]);
  
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start time is now
    lastStartTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      if (lastStartTimeRef.current) {
        // Calculate current elapsed time = accumulated time + (now - last start time)
        const currentTime = accumulatedTimeRef.current + (Date.now() - lastStartTimeRef.current);
        setTime(currentTime);
      }
    }, 1000);
  };

  const handleStart = async () => {
    setIsRunning(true);
    const now = new Date();

    if (!ticketing.mulai_pengerjaan) {
      // First time starting
      await onStatusUpdate({
        id_statuses: 4, // Status 4 for Ongoing
        is_active: 1,  // Mark as active
        mulai_pengerjaan: now.toISOString(),
        response: response,
      });

      accumulatedTimeRef.current = 0;
      lastStartTimeRef.current = now.getTime();
    } else {
      // Resuming after pause
      await onStatusUpdate({
        id_statuses: 4, // Status 4 for Ongoing
        is_active: 1,  // Mark as active
        response: response,
      });
      
      // Start timer from where we left off
      lastStartTimeRef.current = Date.now();
    }

    startTimer();
  };

  const handlePause = async () => {
    setIsRunning(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calculate total time up to this pause point
    if (lastStartTimeRef.current) {
      accumulatedTimeRef.current += (Date.now() - lastStartTimeRef.current);
    }
    lastStartTimeRef.current = null;

    // Create a proper date object for the elapsed time
    const timeAsDate = new Date(0);
    timeAsDate.setMilliseconds(accumulatedTimeRef.current);

    await onStatusUpdate({
      id_statuses: 2, // Status 2 for Pending
      is_active: 1,  // Still active but paused
      waktu_pengerjaan: timeAsDate.toISOString(),
      response: response,
    });
  };

  const handleComplete = async () => {
    setIsRunning(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Calculate final time if timer was running
    if (lastStartTimeRef.current) {
      accumulatedTimeRef.current += (Date.now() - lastStartTimeRef.current);
      setTime(accumulatedTimeRef.current);
    }
    lastStartTimeRef.current = null;

    // Create a proper date object for the elapsed time
    const timeAsDate = new Date(0);
    timeAsDate.setMilliseconds(accumulatedTimeRef.current);

    await onStatusUpdate({
      id_statuses: 1, // Status 1 for Completed
      is_active: 1,  // Mark as inactive
      selesai_pengerjaan: new Date().toISOString(),
      waktu_pengerjaan: timeAsDate.toISOString(),
      response: response,
    });
  };

  // Match TextArea's expected onChange format
  const handleResponseChange = (value: string) => {
    setResponse(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Penanggung Jawab
        </label>
        <Input value={ticketing?.Eskalasi?.name || ""} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Response
        </label>
        <TextArea 
          value={response}
          onChange={handleResponseChange}
          readOnly={ticketing.id_statuses === 1}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mulai Pengerjaan
        </label>
        <Input
          value={
            ticketing?.mulai_pengerjaan
              ? new Date(ticketing.mulai_pengerjaan).toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : "-"
          }
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Selesai Pengerjaan
        </label>
        <Input
          value={
            ticketing?.selesai_pengerjaan
            ? new Date(ticketing.selesai_pengerjaan).toLocaleString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
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
          <Button className="w-full" variant="outline" disabled>
            Tiket Selesai
          </Button>
        )}

        <Button className="w-full" variant="primary" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    </div>
  );
};

export default StatusCard;