import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { PiKeyReturnBold } from "react-icons/pi";

const DesignationManagement = () => {
  const [designations, setDesignations] = useState([]);
  const [newDesignation, setNewDesignation] = useState("");
  const [deleteDesignations, setDeleteDesignations] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchDesignations();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const showError = (err) => {
    setError(err);
    setTimeout(() => setError(null), 3000);
  };

  const fetchDesignations = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/getdesignation",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch designations.");
      const data = await response.json();
      setDesignations(data.data);
    } catch (error) {
      console.error("Error fetching designations:", error);
      showError("Error fetching designations.");
    }
  };

  const handleAddDesignation = async () => {
    if (!newDesignation.trim())
      return alert("Designation name cannot be empty.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/adddesignation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ designation: newDesignation }),
        }
      );
      if (!response.ok) throw new Error("Failed to add designation.");
      const data = await response.json();
      showMessage(data.msg);
      setDesignations(data.data);
      setNewDesignation("");
    } catch (error) {
      console.error("Error adding designation:", error);
      showError("Error adding designation.");
    }
  };

  const handleDeleteDesignations = async () => {
    if (deleteDesignations.length === 0)
      return alert("Select designations to delete.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/deletedesignation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ designations: deleteDesignations }), // Send all selected designations
        }
      );
      if (!response.ok) throw new Error("Failed to delete designations.");
      const data = await response.json();
      showMessage(data.msg);
      setDesignations(data.data);
      setDeleteDesignations([]);
    } catch (error) {
      console.error("Error deleting designations:", error);
      showError("Error deleting designations.");
    }
  };

  const handleclearselection = () => {
    setDeleteDesignations([]);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-2 h-full min-h-full shadow-md rounded-md">
      <div className="md:w-1/3 flex flex-col gap-4 h-full">
        <h1 className="text-base font-bold text-gray-800 dark:text-white">
          Add Designation
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

        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={newDesignation}
            onChange={(e) => setNewDesignation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddDesignation();
              }
            }}
            placeholder="Enter designation name"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 dark:bg-neutral-800"
          />
          <button
            onClick={handleAddDesignation}
            className="w-fit bg-green-600/30 text-green-600 px-3 rounded font-semibold hover:bg-green-700/20 transition duration-300 flex gap-2 items-center"
          >
            <PiKeyReturnBold fontSize={20} />
            Add
          </button>
        </div>

        <div className="text-base font-bold dark:text-white flex items-center gap-2 justify-between">
          <div className="py-1">Designations {designations.length}</div>
          <div className="w-fit">
            {deleteDesignations.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteDesignations}
                  className="w-full bg-red-600/30 text-red-600 p-1 rounded font-semibold hover:bg-red-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <MdDelete fontSize={20} />
                  <span className="text-sm">{deleteDesignations.length}</span>
                </button>
                <button
                  onClick={handleclearselection}
                  className="w-full bg-blue-600/30 text-blue-600 p-1 rounded font-semibold hover:bg-blue-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <IoCloseCircle fontSize={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {designations.length > 0 ? (
          <ul className="flex flex-col gap-2  h-fit overflow-y-scroll scrollbrhdn">
            {designations.map((designation, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-blue-100 dark:bg-neutral-800 rounded shadow-sm cursor-pointer mr-1"
                onClick={() => {
                  if (deleteDesignations.includes(designation)) {
                    setDeleteDesignations((prev) =>
                      prev.filter((d) => d !== designation)
                    );
                  } else {
                    setDeleteDesignations((prev) => [...prev, designation]);
                  }
                }}
              >
                <span className="text-base font-medium">{designation}</span>
                <label
                  className="flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering <li> click
                >
                  <input
                    type="checkbox"
                    checked={deleteDesignations.includes(designation)}
                    onChange={() => {
                      if (deleteDesignations.includes(designation)) {
                        setDeleteDesignations((prev) =>
                          prev.filter((d) => d !== designation)
                        );
                      } else {
                        setDeleteDesignations((prev) => [...prev, designation]);
                      }
                    }}
                    className="hidden"
                  />
                  <span
                    className={`custom-checkbox flex items-center justify-center w-8 h-8 rounded border-2 bg-none border-blue-600 transition-all duration-300 ${
                      deleteDesignations.includes(designation)
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white dark:bg-neutral-800"
                    }`}
                  >
                    {deleteDesignations.includes(designation) && (
                      <FaCheck className="text-white w-3.5 h-3.5 font-extrabold" />
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center dark:bg-neutral-950 h-full rounded-md p-2 flex items-center justify-center">
            No designations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DesignationManagement;
