import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { PiKeyReturnBold } from "react-icons/pi";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [deleteDepartments, setDeleteDepartments] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
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

  // Function to get departments from API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/getdepartment",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch departments.");
      const data = await response.json();
      setDepartments(data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      showError("Error fetching departments.");
    }
  };

  // Function to add department
  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return alert("Department name cannot be empty.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/adddepartment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ departments: [newDepartment] }),
        }
      );
      if (!response.ok) throw new Error("Failed to add department.");
      const data = await response.json();
      showMessage(data.msg);
      setDepartments(data.data);
      setNewDepartment("");
    } catch (error) {
      console.error("Error adding department:", error);
      showError("Error adding department.");
    }
  };

  // Function to delete departments
  const handleDeleteDepartments = async () => {
    if (deleteDepartments.length === 0)
      return alert("Select departments to delete.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/deletedepartment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ departments: deleteDepartments }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete departments.");
      const data = await response.json();
      showMessage(data.msg);
      setDepartments(data.data);
      setDeleteDepartments([]);
    } catch (error) {
      console.error("Error deleting departments:", error);
      showError("Error deleting departments.");
    }
  };

  const handleclearselection = () => {
    setDeleteDepartments([]);
  };

  return (
    <div className=" bg-white dark:bg-neutral-900 p-2 h-full min-h-full  shadow-md rounded-md ">
      <div className="md:w-1/3 flex flex-col gap-4 h-full">
        <h1 className="text-base font-bold  text-gray-800 dark:text-white">
          Add Department
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

        {/* Add Department */}
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddDepartment();
              }
            }}
            placeholder="Enter department name"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 dark:bg-neutral-800"
          />
          <button
            onClick={handleAddDepartment}
            className=" w-fit bg-green-600/30 text-green-600 px-3 rounded font-semibold hover:bg-green-700/20 transition duration-300 flex gap-2 items-center"
          >
            <PiKeyReturnBold fontSize={20} />
            Add
          </button>
        </div>

        {/* List Departments */}
        <div className="text-base font-bold   dark:text-white flex items-center gap-2 justify-between">
          <div className="py-1">Departments {departments.length}</div>
          {/* Delete Selected Departments */}
          <div className="w-fit">
            {deleteDepartments.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteDepartments}
                  className=" w-full bg-red-600/30 text-red-600 p-1 rounded font-semibold hover:bg-red-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <MdDelete fontSize={20} />
                  <span className="text-sm">{deleteDepartments.length}</span>
                </button>
                <button
                  onClick={handleclearselection}
                  className=" w-full bg-blue-600/30 text-blue-600 p-1 rounded font-semibold hover:bg-blue-700/30 transition duration-300 flex gap-1 items-center"
                >
                  <IoCloseCircle fontSize={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        {departments.length > 0 ? (
          <ul className="flex flex-col gap-2  h-fit overflow-y-scroll scrollbrhdn">
            {departments.map((dept, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-blue-100 dark:bg-neutral-800 rounded shadow-sm cursor-pointer mr-1"
                onClick={() => {
                  if (deleteDepartments.includes(dept)) {
                    setDeleteDepartments((prev) =>
                      prev.filter((d) => d !== dept)
                    );
                  } else {
                    setDeleteDepartments((prev) => [...prev, dept]);
                  }
                }}
              >
                <span className="text-base font-medium">{dept}</span>
                <label
                  className="flex items-center cursor-pointer"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering <li> click
                >
                  <input
                    type="checkbox"
                    checked={deleteDepartments.includes(dept)}
                    onChange={() => {
                      if (deleteDepartments.includes(dept)) {
                        setDeleteDepartments((prev) =>
                          prev.filter((d) => d !== dept)
                        );
                      } else {
                        setDeleteDepartments((prev) => [...prev, dept]);
                      }
                    }}
                    className="hidden"
                  />
                  <span
                    className={`custom-checkbox flex items-center justify-center w-8 h-8 rounded border-2 bg-none border-blue-600 transition-all duration-300 ${
                      deleteDepartments.includes(dept)
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white dark:bg-neutral-800"
                    }`}
                  >
                    {deleteDepartments.includes(dept) && (
                      <FaCheck className="text-white w-3.5 h-3.5 font-extrabold" />
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center dark:bg-neutral-950 h-full rounded-md p-2 flex items-center justify-center">
            No departments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
