import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ApiendPonits from "../../api/APIEndPoints.json";
import Loading from "../Loading";
import { leapfrog } from "ldrs";
import { motion } from "framer-motion";

const ProjectBriefforemp = () => {
  const { userData } = useContext(AuthContext);
  const token = userData?.asscessToken;
  const userdata = userData?.employeeData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timesheetData, setTimesheetData] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tooltip, setTooltip] = useState(null); // state for the tooltip content and visibility
  const [filter, setFilter] = useState("top5"); // filter state for "all" or "top5"

  useEffect(() => {
    setCurrentDate(new Date(currentDate).toISOString().split("T")[0]);
  }, [currentDate]);

  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewTimesheet}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              employee_id: userdata._id,
            }),
          }
        );
        setLoading(false);
        const data = await response.json();

        if (data.success) {
          setTimesheetData(data.data);
          setError(null);
        } else {
          setError(data.msg);
        }
      } catch (error) {
        setError("Failed to fetch timesheet data");
      } finally {
        setLoading(false);
      }
    };

    fetchTimesheetData();
  }, [userData?.employeeData?._id]);

  // Function to process and sum durations for each unique project
  const aggregateProjects = (timesheetData) => {
    const projectMap = {};

    timesheetData.forEach((entry) => {
      entry.task.forEach((task) => {
        const projectId = task.project._id;
        if (projectMap[projectId]) {
          projectMap[projectId].duration += task.duration;
        } else {
          projectMap[projectId] = {
            projectname: task.project.projectname,
            duration: task.duration,
          };
        }
      });
    });

    return Object.values(projectMap);
  };

  const aggregatedProjects = aggregateProjects(timesheetData);

  // Sort projects by duration
  const sortedProjects = aggregatedProjects.sort(
    (a, b) => b.duration - a.duration
  );

  // Apply filter logic
  const filteredProjects =
    filter === "top5" ? sortedProjects.slice(0, 5) : sortedProjects;

  // Calculate total duration
  const totalDuration = filteredProjects.reduce(
    (sum, project) => sum + project.duration,
    0
  );

  // Function to calculate the SVG path for a segment (with more rounded edges)
  const getArcPath = (
    startAngle,
    endAngle,
    outerRadius = 50,
    innerRadius = 40,
    gap = 3 // Increase gap for better visual separation
  ) => {
    // Adjust angles to create space between segments
    startAngle += gap;
    endAngle -= gap;

    // Calculate the outer and inner positions for the start and end angles
    const x1 = 60 + outerRadius * Math.cos((Math.PI / 180) * startAngle);
    const y1 = 60 + outerRadius * Math.sin((Math.PI / 180) * startAngle);
    const x2 = 60 + outerRadius * Math.cos((Math.PI / 180) * endAngle);
    const y2 = 60 + outerRadius * Math.sin((Math.PI / 180) * endAngle);

    const x1Inner = 60 + innerRadius * Math.cos((Math.PI / 180) * startAngle);
    const y1Inner = 60 + innerRadius * Math.sin((Math.PI / 180) * startAngle);
    const x2Inner = 60 + innerRadius * Math.cos((Math.PI / 180) * endAngle);
    const y2Inner = 60 + innerRadius * Math.sin((Math.PI / 180) * endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    // Return the path for a more rounded segment with inner hole
    return `
      M ${x1} ${y1} 
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
      L ${x2Inner} ${y2Inner} 
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner} 
      Z
    `;
  };

  // Color palette
  const colorsLight = [
    "#7a00db",
    "#ff6384",
    "#36a2eb",
    "#ffcd56",
    "#ff5733",
    "#28a745",
    "#fd067e",
    "#79c9b2",
    "#67d244",
    "#be2057",
    "#3cb77d",
    "#04bcf4",
    "#ac09bf",
    "#4eff48",
    "#7ccf77",
    "#47ebf2",
    "#9b6699",
    "#dab44b",
    "#036e86",
    "#1f2720",
    "#d93a01",
    "#17f5bf",
    "#b4d762",
    "#d71ec5",
    "#7d68d9",
    "#886694",
    "#0c9cc3",
    "#0d3414",
    "#1ad2d1",
    "#d1a13e",
    "#f5efd4",
    "#6bcb84",
    "#105abb",
    "#8e516a",
    "#eace98",
    "#7a1e6d",
    "#df2bad",
    "#3982ff",
    "#fca071",
    "#84b8b7",
    "#a6f2e3",
    "#9b745c",
    "#94cbf3",
    "#78c4c6",
    "#f375e7",
    "#f17de4",
    "#09494e",
    "#a1f85c",
    "#2dbde6",
  ];

  let startAngle = 0;

  // Function to handle mouse hover for showing the tooltip
  const handleMouseEnter = (projectname, duration, color) => {
    setTooltip({
      projectname,
      duration,
      color,
      visible: true, // Make tooltip visible
    });
  };

  // Function to handle mouse move to update tooltip position
  const handleMouseMove = (e) => {
    if (tooltip) {
      // Add some offset for better positioning
      let tooltipX = e.clientX + 15;
      let tooltipY = e.clientY + 15;

      // Prevent the tooltip from overflowing the screen width
      const tooltipWidth = 200; // Estimate the tooltip width (adjust as needed)
      const screenWidth = window.innerWidth;

      if (tooltipX + tooltipWidth > screenWidth) {
        tooltipX = screenWidth - tooltipWidth - 15; // Ensure tooltip stays within the screen
      }

      setTooltip((prev) => ({
        ...prev,
        x: tooltipX,
        y: tooltipY,
      }));
    }
  };

  // Function to handle mouse leave to hide the tooltip
  const handleMouseLeave = () => {
    setTooltip(null); // Hide tooltip
  };

  useEffect(() => {
    // Add event listener for mouse move
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tooltip]);

  const formatDuration = (duration) => {
    if (duration >= 1000) {
      return `${(duration / 1000).toFixed(1)}k`; // Shorten to k (e.g., 1500 -> 1.5k)
    }
    return duration; // No change for durations less than 1000
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <h1 className="text-center md:text-start text-base">
        Projects by duration
      </h1>

      {loading ? (
        <div className=" flex items-center justify-center h-full">
          <l-leapfrog size="40" speed="2.5" color="#285999"></l-leapfrog>
        </div>
      ) : (
        <div className="flex flex-col h-full ">
          {/* Filter */}
          <div className="bg-blue-50 dark:bg-neutral-900 p-1 rounded-md flex items-center w-full md:w-fit">
            <div className="flex gap-1 w-full">
              <button
                onClick={() => setFilter("top5")}
                className={`${
                  filter === "top5"
                    ? "bg-blue-500/30 text-blue-500"
                    : "bg-blue-100 dark:bg-neutral-800"
                } px-4 py-2 rounded-md focus:outline-none w-full md:w-fit`}
              >
                Top 5 by Duration
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`${
                  filter === "all"
                    ? "bg-blue-500/30 text-blue-500"
                    : "bg-blue-100 dark:bg-neutral-800"
                } px-4 py-2 rounded-md focus:outline-none w-full md:w-fit`}
              >
                All Projects
              </button>
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="w-full md:w-1/2">
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Doughnut Chart */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                  <svg
                    className="absolute top-0 left-0"
                    width="100%"
                    height="100%"
                    viewBox="0 0 120 120"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    {/* Inner Circle (Hole) */}
                    <circle cx="60" cy="60" r="40" fill="transparent" />

                    {/* Doughnut Chart Segments */}
                    {filteredProjects.map((project, index) => {
                      const percentage =
                        (project.duration / totalDuration) * 100;
                      const endAngle = startAngle + (percentage / 100) * 360;
                      const pathData = getArcPath(startAngle, endAngle, 50, 40);
                      startAngle = endAngle; // Update start angle for next segment
                      const strokeColor =
                        colorsLight[index % colorsLight.length]; // Use colorsLight array

                      return (
                        <path
                          key={project.projectname}
                          d={pathData}
                          fill={strokeColor}
                          stroke={strokeColor}
                          strokeWidth={3} // Optional: add stroke for clearer separation
                          strokeLinejoin="round" // Ensures the corners are rounded
                          onMouseEnter={() =>
                            handleMouseEnter(
                              project.projectname,
                              project.duration,
                              strokeColor
                            )
                          }
                          onMouseLeave={handleMouseLeave}
                          className="transform origin-center hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                      );
                    })}
                  </svg>
                  {/* Grand Total Hours Card */}
                  <div className="text-xl font-semibold">
                    {formatDuration(totalDuration)} hours
                  </div>
                </div>
                {/* Project List */}
                <ul className="px-10 md:px-0 text-cente w-full md:w-1/2 flex flex-col gap-2 mb-4 md:mb-0 max-h-40 overflow-y-scroll scrollbrhdn">
                  {filteredProjects.map((project, index) => {
                    const color = colorsLight[index % colorsLight.length]; // Use the color corresponding to the project
                    return (
                      <li key={project.projectname} className="flex w-full">
                        <div className="flex items-center justify-between w-full">
                          <span className="flex items-center gap-2">
                            <span
                              className="block w-3 h-3 rounded-sm"
                              style={{ backgroundColor: color }} // Display the color dot next to the project name
                            ></span>
                            {project.projectname}
                          </span>
                          <span className="md:pr-2">
                            {project.duration} hours
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="absolute dark:text-white p-2 bg-sky-200/20 dark:bg-neutral-800/30 backdrop-blur-lg rounded-lg"
                  style={{
                    top: tooltip.y,
                    left: tooltip.x,
                    visibility: tooltip.visible ? "visible" : "hidden",
                    zIndex: 10,
                  }}
                >
                  <span
                    className="block w-8 h-3 rounded-sm"
                    style={{ backgroundColor: tooltip.color }} // Display the color dot next to the project name
                  ></span>
                  <p className="mt-2 font-extrabold">{tooltip.projectname}</p>
                  <p className="mt-">{`${tooltip.duration} hours`}</p>
                </div>
              )}
            </div>
          ) : (
            <div className=" flex items-center justify-center h-full my-10 md:my-0">
              No projects available.
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ProjectBriefforemp;
