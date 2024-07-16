import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import User from "./components/User";
import Leave from "./components/Leave";
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
        //admin accessible routes
        <>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="projects" element={<Projects />} />
          <Route path="Pim" element={<Pim />} />
          <Route path="pim/employeelist" element={<Employeelist />} />
          <Route path="pim/addemployee" element={<Addemployee />} />
          <Route path="pim/leave" element={<Leave />} />
          <Route
            path="/pim/edit/:empid/:ename/:designation/:jdate/:status"
            element={<EditEmployee />}
          />
          <Route
            path="/pim/view/:empid/:ename/:designation/:jdate/:status"
            element={<ViewEmployee />}
          />
          <Route path="clients/viewclient" element={<ViewClient />} />
          <Route path="clients/addclient" element={<Addclient />} />
          <Route path="projects/addproject" element={<Addproject />} />
          <Route
            path="/projects/viewproject/:projectId"
            element={<ViewProject />}
          />
        </>
      );
    } else {
      //employee accessible routes
      return <Route index element={<Dashboard />} />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
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
