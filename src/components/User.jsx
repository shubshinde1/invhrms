import React, { useState } from "react";

export default function User() {
  // Create an array of 10 elements to represent the rows
  const rows = Array.from({ length: 80 });
  // Create an array of 20 elements to represent the columns
  const columns = Array.from({ length: 20 });

  // Define the pattern for "SHUB"
  const shubPattern = {
    // Coordinates for the letter "S"
    S: [
      [5, 3],
      [5, 4],
      [5, 5],
      [6, 5],
      [5, 6],
      [6, 6],
      [5, 7],
      [6, 7],
      [5, 8],
      [6, 8],
      [7, 8],
      [7, 7],
      [8, 8],
      [8, 7],
      [9, 8],
      [9, 7],
      [10, 8],
      [10, 7],
      [11, 8],
      [11, 7],
      [11, 9],
      [11, 10],
      [10, 9],
      [10, 10],
      [11, 9],
      [11, 10],
      [12, 9],
      [12, 10],
      [6, 3],
      [6, 4],
      [7, 3],
      [7, 4],
      [8, 3],
      [8, 4],
      [9, 3],
      [9, 4],
      [10, 3],
      [10, 4],
      [11, 3],
      [11, 4],
    ],
    // Coordinates for the letter "H"
    H: [[], [], [], [], [], [], [], [], [], [], []],
    // Coordinates for the letter "U"
    U: [[], [], [], [], [], [], [], [], [], [], [], []],
    // Coordinates for the letter "B"
    B: [[], [], [], [], [], [], [], [], [], [], [], []],
  };

  // Combine all coordinates into one array
  const allShubDots = [
    ...shubPattern.S,
    ...shubPattern.H,
    ...shubPattern.U,
    ...shubPattern.B,
  ];

  // State to track if the grid is hovered
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {columns.map((_, colIndex) => (
        <div key={colIndex} className="flex gap-2">
          {rows.map((_, rowIndex) => {
            const isShubDot = allShubDots.some(
              ([row, col]) => row === rowIndex + 1 && col === colIndex + 1
            );
            return (
              <div
                key={rowIndex}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  isHovered && isShubDot ? "bg-red-500" : "bg-neutral-700"
                } ${isHovered ? "" : ""}`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
