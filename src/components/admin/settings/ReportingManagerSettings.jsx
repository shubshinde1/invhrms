import React, { useState, useEffect } from "react";

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        ReportingTo Management
      </h2>

      {message && (
        <div className="mb-4 text-center text-green-600">{message}</div>
      )}
      {error && <div className="mb-4 text-center text-red-600">{error}</div>}

      {/* Add ReportingTo */}
      <div className="mb-6">
        <input
          type="text"
          value={newReportingTo}
          onChange={(e) => setNewReportingTo(e.target.value)}
          placeholder="Enter reportingTo name"
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddReportingTo}
          className="mt-3 w-full bg-blue-600 text-white px-5 py-3 rounded font-semibold hover:bg-blue-700 transition duration-300"
        >
          Add ReportingTo
        </button>
      </div>

      {/* List ReportingTo */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-600">
        Available ReportingTo
      </h3>
      {reportingTo.length > 0 ? (
        <ul className="space-y-3">
          {reportingTo.map((rep, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-gray-100 rounded shadow-sm"
            >
              <span className="text-lg font-medium text-gray-800">{rep}</span>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setDeleteReportingTo((prev) => [...prev, rep]);
                  } else {
                    setDeleteReportingTo((prev) =>
                      prev.filter((r) => r !== rep)
                    );
                  }
                }}
                className="w-5 h-5 text-red-500 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No reportingTo found.</p>
      )}

      {/* Delete Selected ReportingTo */}
      {deleteReportingTo.length > 0 && (
        <button
          onClick={handleDeleteReportingTo}
          className="mt-6 w-full bg-red-600 text-white px-5 py-3 rounded font-semibold hover:bg-red-700 transition duration-300"
        >
          Delete Selected ({deleteReportingTo.length})
        </button>
      )}
    </div>
  );
};

export default ReportingToManagement;
