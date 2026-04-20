"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(expiresAt: string): TimeLeft {
  const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

type Props = {
  expiresAt: string;
};

export default function Countdown({ expiresAt }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(expiresAt)), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const expired = Object.values(timeLeft).every((v) => v === 0);

  if (expired) {
    return (
      <div className="text-center py-4 text-sm text-gray-400 font-medium">
        This offer has expired
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-2xl px-6 py-5 flex flex-col items-center gap-4">
      {/* Urgency text */}
      <div className="text-center space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
          ⚡ Limited time offer
        </p>
        <p className="text-base font-semibold text-gray-800">
          Don't miss out — prices go back up when the timer hits zero
        </p>
      </div>

      {/* Timer blocks */}
      <div className="flex items-center gap-2">
        {units.map(({ label, value }, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center bg-gray-900 text-white rounded-xl px-4 py-3 min-w-[60px]">
              <span className="text-2xl font-bold tabular-nums leading-none">
                {pad(value)}
              </span>
              <span className="text-xs text-gray-400 mt-1">{label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="text-gray-400 font-bold text-xl mb-4">:</span>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Offer ends in {timeLeft.days}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m — grab yours before it's gone
      </p>
    </div>
  );
}
