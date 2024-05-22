import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeList from "./Employeelist";
import AddEmployee from "./Addemployee";
import MenuTabs from "./Menutabs";

export default function App() {
  return (
    <Router>
      <div>
        <MenuTabs />
        <Routes>
          <Route path="/employeelist" element={<EmployeeList />} />
          <Route path="/addemployee" element={<AddEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}
