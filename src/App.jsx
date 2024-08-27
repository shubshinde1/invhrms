import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import User from "./components/User";
import RefillLeaves from "./components/admin/leave/RefillLeaves";
import Pim from "./components/Pim";
import Clients from "./components/Clients";
import Projects from "./components/Projects";
import Employeelist from "./components/pim/Employeelist";
import Addemployee from "./components/pim/Addemployee";
import EditEmployee from "./components/pim/EditEmployee";
import ViewEmployee from "./components/pim/ViewEmployee";
import Addclient from "./components/client/Addclient";
import ViewClient from "./components/client/ViewClient";
import Addproject from "./components/projects/Addproject";
import Login from "./components/Login";
import ViewProject from "./components/project/ViewProject";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "../src/contexts/AuthContext";
import NotFound from "./NotFound";
import Timesheet from "./components/timesheet/TimeSheet";

//userprofile
import UserProfile from "../src/components/userprofile/UserProfile";
import UserLeave from "./components/userleave/UserLeave";
import AttendanceHistory from "./components/dashboard/AttendanceHistory";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const renderRoutes = () => {
    if (userData?.employeeData?.auth === 1) {
      return (
        // Admin accessible routes
        <>
          <Route index element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/Pim" element={<Pim />} />
          <Route path="/pim/employeelist" element={<Employeelist />} />
          <Route path="/pim/addemployee" element={<Addemployee />} />
          <Route path="/pim/addholidays" element={<RefillLeaves />} />
          <Route
            path="/pim/edit/:empid/:ename/:designation/:jdate/:status"
            element={<EditEmployee />}
          />
          <Route
            path="/pim/view/:empid/:ename/:designation/:jdate/:status"
            element={<ViewEmployee />}
          />
          <Route path="/clients/viewclient" element={<ViewClient />} />
          <Route path="/clients/addclient" element={<Addclient />} />
          <Route path="/projects/addproject" element={<Addproject />} />
          <Route
            path="/projects/viewproject/:projectId"
            element={<ViewProject />}
          />
        </>
      );
    } else {
      // Employee accessible routes
      return (
        <>
          <Route index element={<Dashboard />} />
          <Route path="/myprofile" element={<UserProfile />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/leave" element={<UserLeave />} />
          <Route path="/Attendance" element={<AttendanceHistory />} />

          {/* <Route path="*" element={<NotFound />} /> */}
        </>
      );
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound theme={theme} />} />
        <Route path="/login" element={<Login theme={theme} />} />
        <Route path="/register" element={<Register theme={theme} />} />
        <Route
          path="/resetpassword"
          element={<ResetPassword theme={theme} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={() => (
                <Layout theme={theme} handleThemeSwitch={handleThemeSwitch} />
              )}
            />
          }
        >
          {renderRoutes()}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
