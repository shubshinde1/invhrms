import React, { useState } from "react";
import Menutabs from "../../pim/Menutabs";
import { motion } from "framer-motion";
import { FaFaceFrownOpen, FaFaceGrinHearts } from "react-icons/fa6";
import { TextField, Button, Grid, Paper } from "@mui/material";

const RefillLeaves = () => {
  const [optionalHoliday, setOptionalHoliday] = useState([]);
  const [mandatoryHoliday, setMandatoryHoliday] = useState([]);
  const [weekendHoliday, setWeekendHoliday] = useState([]);
  const [error, setError] = useState(null);

  const handleHolidayChange = (setter) => (e, index) => {
    const { name, value } = e.target;
    const updatedHolidays = [...setter];
    updatedHolidays[index] = { ...updatedHolidays[index], [name]: value };
    setter(updatedHolidays);
  };

  const handleAddHoliday = (type) => {
    const holiday = { name: "", date: "", greeting: "" };
    if (type === "optional") {
      setOptionalHoliday([...optionalHoliday, holiday]);
    } else if (type === "mandatory") {
      setMandatoryHoliday([...mandatoryHoliday, holiday]);
    } else if (type === "weekend") {
      setWeekendHoliday([...weekendHoliday, holiday]);
    }
  };

  const handleRemoveHoliday = (type, index) => {
    if (type === "optional") {
      setOptionalHoliday(optionalHoliday.filter((_, i) => i !== index));
    } else if (type === "mandatory") {
      setMandatoryHoliday(mandatoryHoliday.filter((_, i) => i !== index));
    } else if (type === "weekend") {
      setWeekendHoliday(weekendHoliday.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/addholidays",
        {
          optionalholiday: optionalHoliday,
          mandatoryholiday: mandatoryHoliday,
          weekendHoliday: weekendHoliday,
        },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ensure token is defined or obtained
          },
        }
      );
      alert("Holidays added successfully.");
    } catch (error) {
      setError("Error adding holidays. Please try again.");
      console.error(error);
    }
  };

  return (
    <Paper style={{ padding: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h2>Optional Holidays</h2>
          {optionalHoliday.map((holiday, index) => (
            <div key={index}>
              <TextField
                label="Name"
                name="name"
                value={holiday.name}
                onChange={(e) =>
                  handleHolidayChange(setOptionalHoliday)(e, index)
                }
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                name="date"
                value={holiday.date}
                onChange={(e) =>
                  handleHolidayChange(setOptionalHoliday)(e, index)
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <Button onClick={() => handleRemoveHoliday("optional", index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddHoliday("optional")}>
            Add Optional Holiday
          </Button>
        </Grid>

        <Grid item xs={12}>
          <h2>Mandatory Holidays</h2>
          {mandatoryHoliday.map((holiday, index) => (
            <div key={index}>
              <TextField
                label="Name"
                name="name"
                value={holiday.name}
                onChange={(e) =>
                  handleHolidayChange(setMandatoryHoliday)(e, index)
                }
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                name="date"
                value={holiday.date}
                onChange={(e) =>
                  handleHolidayChange(setMandatoryHoliday)(e, index)
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Greeting"
                name="greeting"
                value={holiday.greeting}
                onChange={(e) =>
                  handleHolidayChange(setMandatoryHoliday)(e, index)
                }
                fullWidth
              />
              <Button onClick={() => handleRemoveHoliday("mandatory", index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddHoliday("mandatory")}>
            Add Mandatory Holiday
          </Button>
        </Grid>

        <Grid item xs={12}>
          <h2>Weekend Holidays</h2>
          {weekendHoliday.map((holiday, index) => (
            <div key={index}>
              <TextField
                label="Name"
                name="name"
                value={holiday.name}
                onChange={(e) =>
                  handleHolidayChange(setWeekendHoliday)(e, index)
                }
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                name="date"
                value={holiday.date}
                onChange={(e) =>
                  handleHolidayChange(setWeekendHoliday)(e, index)
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Greeting"
                name="greeting"
                value={holiday.greeting}
                onChange={(e) =>
                  handleHolidayChange(setWeekendHoliday)(e, index)
                }
                fullWidth
              />
              <Button onClick={() => handleRemoveHoliday("weekend", index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddHoliday("weekend")}>
            Add Weekend Holiday
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <p style={{ color: "red" }}>{error}</p>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Holidays
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RefillLeaves;
