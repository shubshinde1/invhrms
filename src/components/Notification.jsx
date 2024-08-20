// src/components/Notification.js
import React, { useEffect, useState } from "react";
import "./Notification.css"; // Import CSS for styling

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Hide notification after 4 seconds

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default Notification;
