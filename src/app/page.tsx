"use client";

import Calendar from "@/components/Calendar";
import React, { useState } from 'react';

export default function Home() {
  const selectedDate1 = useState<{ day?: number, month?: number, year?: number }>({day: 1, month: 11, year: 2024})
  const selectedDate2 = useState<{ day?: number, month?: number, year?: number }>({day: 1, month: 11, year: 2024})
  const selectedDate3 = useState<{ day?: number, month?: number, year?: number }>({day: 1, month: 11, year: 2024})
  const formatDate = ({ day, month, year }: { day?: number, month?: number, year?: number }) => {
    return year && month && day ? `${day}/${month}/${year}` : '--/--/----';
  };

  return (
    <div className="flex gap-[20px] flex-wrap">
      <div>
        <h1 className="text-center">Default Calendar</h1>
        <Calendar
          selected={selectedDate1}
        />
        <p className="text-center">Selected: {formatDate(selectedDate1[0])}</p>
      </div>
      <div>
        <h1 className="text-center">Highlighted Calendar</h1>
        <Calendar
          selected={selectedDate2}
          highlights={[
            {from: new Date('2024 09 01'), to: new Date('2024 09 20'), class: 'bg-green-500'},
            {from: new Date('2024 10 29'), to: new Date('2024 11 03'), class: 'bg-red-500'},
            {from: new Date('2024 11 10'), to: new Date('2024 11 20'), class: 'bg-yellow-500'}
          ]}
        />
        <p className="text-center">Selected: {formatDate(selectedDate2[0])}</p>
        <p className="text-center">*You can only select highlighed date</p>
      </div>
      <div>
        <h1 className="text-center">2024 Calendar</h1>
        <Calendar
          selected={selectedDate3}
          range={{from: new Date('2024 01 01'), to: new Date('2024 12 31')}}
        />
        <p className="text-center">Selected: {formatDate(selectedDate3[0])}</p>
      </div>
    </div>
  );
}
