import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { PiKeyReturnBold } from "react-icons/pi";

const ReportingToManagement = () => {
  const [reportingTo, setReportingTo] = useState([]);
  const [newReportingTo, setNewReportingTo] = useState("");
  const [deleteReportingTo, setDeleteReportingTo] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Fetch reportingTo on component mount
  useEffect(() => {
    fetchReportingTo();
  }, []);

  // Function to show message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // Function to show error
  const showError = (err) => {
    setError(err);
    setTimeout(() => setError(null), 3000);
  };

  // Function to get reportingTo from API
  const fetchReportingTo = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/getreportingto",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch reportingTo.");
      const data = await response.json();
      setReportingTo(data.data);
    } catch (error) {
      console.error("Error fetching reportingTo:", error);
      showError("Error fetching reportingTo.");
    }
  };

  // Function to add reportingTo
  const handleAddReportingTo = async () => {
    if (!newReportingTo.trim())
      return alert("ReportingTo name cannot be empty.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/addreportingto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reportingTo: [newReportingTo] }),
        }
      );
      if (!response.ok) throw new Error("Failed to add reportingTo.");
      const data = await response.json();
      showMessage(data.msg);
      setReportingTo(data.data);
      setNewReportingTo("");
    } catch (error) {
      console.error("Error adding reportingTo:", error);
      showError("Error adding reportingTo.");
    }
  };

  // Function to delete reportingTo
  const handleDeleteReportingTo = async () => {
    if (deleteReportingTo.length === 0)
      return alert("Select reportingTo to delete.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/deletereportingto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reportingTo: deleteReportingTo }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete reportingTo.");
      const data = await response.json();
      showMessage(data.msg);
      setReportingTo(data.data);
      setDeleteReportingTo([]);
    } catch (error) {
      console.error("Error deleting reportingTo:", error);
      showError("Error deleting reportingTo.");
    }
  };

  const handleClearSelection = () => {
    setDeleteReportingTo([]);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-2 h-full min-h-full shadow-md rounded-md">
      <div className="md:w-1/3 flex flex-col gap-4 h-full">
        <h1 className="text-base font-bold text-gray-800 dark:text-white">
          Add ReportingTo
        </h1>

        {message && (
          <div className="bg-green-500/20 text-green-600 text-base absolute bottom-2 right-2 px-3 py-2 rounded-md font-bold">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-600 text-base absolute bottom-2 right-2 px-3 py-2 rounded-md font-bold">
            {error}
          </div>
        )}

        {/* Add ReportingTo */}
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={newReportingTo}
            onChange={(e) => setNewReportingTo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddReportingTo();
              }
            }}
            placeholder="Enter reportingTo name"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 dark:bg-neutral-800"
          />
          <button
            onClick={handleAddReportingTo}
            className="w-fit bg-green-600/30 text-green-600 px-3 rounded font-semibold hover:bg-green-700/20 transition duration-300 flex gap-2 items-center"
          >
            <PiKeyReturnBold fontSize={20} />
            Add
          </button>
        </div>

        {/* List ReportingTo */}
        <div className="text-base font-bold dark:text-white flex items-center gap-2 justify-between">
          <div className="py-1">ReportingTo {reportingTo.length}</div>
          {/* Delete Selected ReportingTo */}
          <div className="w-fit">
            {deleteReportingTo.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteReportingTo}
                  className="w-full bg-red-600/30 text-red-600 p-1 rounded font-semibold hover:bg-red-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <MdDelete fontSize={20} />
                  <span className="text-sm">{deleteReportingTo.length}</span>
                </button>
                <button
                  onClick={handleClearSelection}
                  className="w-full bg-blue-600/30 text-blue-600 p-1 rounded font-semibold hover:bg-blue-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <IoCloseCircle fontSize={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {reportingTo.length > 0 ? (
          <ul className="flex flex-col gap-2  h-fit overflow-y-scroll scrollbrhdn">
            {reportingTo.map((rep, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-blue-100 dark:bg-neutral-800 rounded shadow-sm cursor-pointer mr-1"
                onClick={() => {
                  if (deleteReportingTo.includes(rep)) {
                    setDeleteReportingTo((prev) =>
                      prev.filter((r) => r !== rep)
                    );
                  } else {
                    setDeleteReportingTo((prev) => [...prev, rep]);
                  }
                }}
              >
                <span className="text-base font-medium">{rep}</span>
                <label
                  className="flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering <li> click
                >
                  <input
                    type="checkbox"
                    checked={deleteReportingTo.includes(rep)}
                    onChange={() => {
                      if (deleteReportingTo.includes(rep)) {
                        setDeleteReportingTo((prev) =>
                          prev.filter((r) => r !== rep)
                        );
                      } else {
                        setDeleteReportingTo((prev) => [...prev, rep]);
                      }
                    }}
                    className="hidden"
                  />
                  <span
                    className={`custom-checkbox flex items-center justify-center w-8 h-8 rounded border-2 bg-none border-blue-600 transition-all duration-300 ${
                      deleteReportingTo.includes(rep)
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white dark:bg-neutral-800"
                    }`}
                  >
                    {deleteReportingTo.includes(rep) && (
                      <FaCheck className="text-white w-3.5 h-3.5 font-extrabold" />
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center dark:bg-neutral-950 h-full rounded-md p-2 flex items-center justify-center">
            No reportingTo found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportingToManagement;
