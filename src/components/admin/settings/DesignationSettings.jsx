import React, { useState, useEffect } from "react";

const DesignationManagement = () => {
  const [designations, setDesignations] = useState([]);
  const [newDesignation, setNewDesignation] = useState("");
  const [deleteDesignations, setDeleteDesignations] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Fetch designations on component mount
  useEffect(() => {
    fetchDesignations();
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

  // Function to get designations from API
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

  // Function to add designation
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

  // Function to delete designations
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
          body: JSON.stringify({ designation: deleteDesignations[0] }), // Sending only the selected designation to delete
        }
      );
      if (!response.ok) throw new Error("Failed to delete designation.");
      const data = await response.json();
      showMessage(data.msg);
      setDesignations(data.data);
      setDeleteDesignations([]);
    } catch (error) {
      console.error("Error deleting designation:", error);
      showError("Error deleting designation.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Designation Management
      </h2>

      {message && (
        <div className="mb-4 text-center text-green-600">{message}</div>
      )}
      {error && <div className="mb-4 text-center text-red-600">{error}</div>}

      {/* Add Designation */}
      <div className="mb-6">
        <input
          type="text"
          value={newDesignation}
          onChange={(e) => setNewDesignation(e.target.value)}
          placeholder="Enter designation name"
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddDesignation}
          className="mt-3 w-full bg-blue-600 text-white px-5 py-3 rounded font-semibold hover:bg-blue-700 transition duration-300"
        >
          Add Designation
        </button>
      </div>

      {/* List Designations */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-600">
        Available Designations
      </h3>
      {designations.length > 0 ? (
        <ul className="space-y-3">
          {designations.map((designation, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-gray-100 rounded shadow-sm"
            >
              <span className="text-lg font-medium text-gray-800">
                {designation}
              </span>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setDeleteDesignations((prev) => [...prev, designation]);
                  } else {
                    setDeleteDesignations((prev) =>
                      prev.filter((d) => d !== designation)
                    );
                  }
                }}
                className="w-5 h-5 text-red-500 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No designations found.</p>
      )}

      {/* Delete Selected Designations */}
      {deleteDesignations.length > 0 && (
        <button
          onClick={handleDeleteDesignations}
          className="mt-6 w-full bg-red-600 text-white px-5 py-3 rounded font-semibold hover:bg-red-700 transition duration-300"
        >
          Delete Selected ({deleteDesignations.length})
        </button>
      )}
    </div>
  );
};

export default DesignationManagement;
