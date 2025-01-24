import React, { useState, useEffect } from "react";
import axios from "axios";

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    department: [],
    country: [],
    reportingTo: [],
    designation: [],
  });

  const [newItem, setNewItem] = useState("");
  const [selectedField, setSelectedField] = useState("department");

  // Fetch current settings when the component mounts
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch settings from backend
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`/settings/${selectedField}`);
      setSettings((prevSettings) => ({
        ...prevSettings,
        [selectedField]: response.data.data || [],
      }));
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  // Handle adding a new item to the selected field
  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      await axios.put("/settings/update", {
        field: selectedField,
        value: [...settings[selectedField], newItem],
      });
      setNewItem("");
      fetchSettings(); // Reload settings after adding
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Handle deleting an item from the selected field
  const handleDeleteItem = async (item) => {
    try {
      await axios.delete("/settings/delete", {
        data: { field: selectedField, item },
      });
      fetchSettings(); // Reload settings after deleting
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="settings-manager">
      <h1>Settings Manager</h1>

      {/* Select field */}
      <div>
        <label htmlFor="field-select">Choose Field:</label>
        <select
          id="field-select"
          value={selectedField}
          onChange={(e) => {
            setSelectedField(e.target.value);
            fetchSettings(); // Reload settings when field changes
          }}
        >
          <option value="department">Department</option>
          <option value="country">Country</option>
          <option value="reportingTo">Reporting To</option>
          <option value="designation">Designation</option>
        </select>
      </div>

      {/* Display current items in the selected field */}
      <div>
        <h3>
          {selectedField.charAt(0).toUpperCase() + selectedField.slice(1)}
        </h3>
        <ul>
          {settings[selectedField].map((item, index) => (
            <li key={index}>
              {item}{" "}
              <button onClick={() => handleDeleteItem(item)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Input to add new item */}
      <div>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Add new ${selectedField}`}
        />
        <button onClick={handleAddItem}>Add</button>
      </div>
    </div>
  );
};

export default SettingsManager;
