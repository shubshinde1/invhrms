import React, { useState, useEffect } from "react";

const CountryManagement = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [deleteCountries, setDeleteCountries] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
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

  // Function to get countries from API
  const fetchCountries = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/getcountry",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch countries.");
      const data = await response.json();
      setCountries(data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      showError("Error fetching countries.");
    }
  };

  // Function to add country
  const handleAddCountry = async () => {
    if (!newCountry.trim()) return alert("Country name cannot be empty.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/addcountry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ countries: [newCountry] }),
        }
      );
      if (!response.ok) throw new Error("Failed to add country.");
      const data = await response.json();
      showMessage(data.msg);
      setCountries(data.data);
      setNewCountry("");
    } catch (error) {
      console.error("Error adding country:", error);
      showError("Error adding country.");
    }
  };

  // Function to delete countries
  const handleDeleteCountries = async () => {
    if (deleteCountries.length === 0)
      return alert("Select countries to delete.");

    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/deletecountry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ countries: deleteCountries }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete countries.");
      const data = await response.json();
      showMessage(data.msg);
      setCountries(data.data);
      setDeleteCountries([]);
    } catch (error) {
      console.error("Error deleting countries:", error);
      showError("Error deleting countries.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Country Management
      </h2>

      {message && (
        <div className="mb-4 text-center text-green-600">{message}</div>
      )}
      {error && <div className="mb-4 text-center text-red-600">{error}</div>}

      {/* Add Country */}
      <div className="mb-6">
        <input
          type="text"
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          placeholder="Enter country name"
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddCountry}
          className="mt-3 w-full bg-blue-600 text-white px-5 py-3 rounded font-semibold hover:bg-blue-700 transition duration-300"
        >
          Add Country
        </button>
      </div>

      {/* List Countries */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-600">
        Available Countries
      </h3>
      {countries.length > 0 ? (
        <ul className="space-y-3">
          {countries.map((country, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-gray-100 rounded shadow-sm"
            >
              <span className="text-lg font-medium text-gray-800">
                {country}
              </span>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setDeleteCountries((prev) => [...prev, country]);
                  } else {
                    setDeleteCountries((prev) =>
                      prev.filter((c) => c !== country)
                    );
                  }
                }}
                className="w-5 h-5 text-red-500 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No countries found.</p>
      )}

      {/* Delete Selected Countries */}
      {deleteCountries.length > 0 && (
        <button
          onClick={handleDeleteCountries}
          className="mt-6 w-full bg-red-600 text-white px-5 py-3 rounded font-semibold hover:bg-red-700 transition duration-300"
        >
          Delete Selected ({deleteCountries.length})
        </button>
      )}
    </div>
  );
};

export default CountryManagement;
