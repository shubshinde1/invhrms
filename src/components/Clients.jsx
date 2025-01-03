import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientCard from "./client/ClientCard";
import Projects from "./Projects"; // Import the Projects component
import clientsData from "../dummydata/MasterClientsProjects.json"; // Import clientData

export default function Clients() {
  return (
    <div className="h-full pb-20">
      <ClientCard />
    </div>
  );
}
