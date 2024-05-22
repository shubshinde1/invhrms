import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientCard from "./client/ClientCard";
import Projects from "./Projects"; // Import the Projects component
import clientData from "./client/MasterClientsProjects.json"; // Import clientData

export default function Clients() {
  return (
    <div>
      <ClientCard />
    </div>
  );
}
