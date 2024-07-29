import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles for the calendar

const CustomCalendar = ({ timesheetData }) => {
  const [date, setDate] = useState(new Date());

  const getTileClassName = (date) => {
    const dateString = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD string
    if (timesheetData[dateString] && timesheetData[dateString].length > 0) {
      return "bg-green-500 text-white"; // Tailwind class for filled dates
    } else {
      return "bg-red-500 text-white"; // Tailwind class for empty dates
    }
  };

  return (
    <div className="p-4">
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date }) => getTileClassName(date)}
        className="react-calendar rounded-lg"
      />
    </div>
  );
};

export default CustomCalendar;
