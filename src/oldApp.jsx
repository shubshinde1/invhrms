import { useState, useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
// import Myprofile from "./components/Myprofile";
import User from "./components/User";
// import Task from "./components/Task";
import Leave from "./components/Leave";
// import Claim from "./components/Claim";
// import Login from "./components/Login";
import Pim from "./components/Pim";
import Clients from "./components/Clients";
import Projects from "./components/Projects";
import Employeelist from "./components/pim/Employeelist";
import Addemployee from "./components/pim/Addemployee";
import EditEmployee from "./components/pim/EditEmployee";
import ViewEmployee from "./components/pim/ViewEmployee";
// import leave from "./components/pim/Leave";
import Addclient from "./components/client/Addclient";
import ViewClient from "./components/client/ViewClient";
import Addproject from "./components/projects/Addproject";
// import Loginimg from "../src/assets/images/login.svg";
// import logo from "../src/assets/images/invezza-logo.png";
import ViewProject from "./components/project/ViewProject";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Apply theme to the document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Store theme preference in local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* {isAuthenticated ? ( */}
      <Router>
        <Routes>
          {/* <Route index element={<Login />} /> */}
          <Route
            path="/"
            element={
              <Layout theme={theme} handleThemeSwitch={handleThemeSwitch} />
            }
          >
            <Route index element={<Dashboard />} />
            {/* <Route path="home" element={<Dashboard />} /> */}
            {/* <Route path="leave" element={<Leave />} /> */}
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            {/* <Route path="myprofile" element={<Myprofile />} /> */}
            {/* <Route path="Task" element={<Task />} /> */}
            <Route path="User" element={<User />} />
            {/* <Route path="Claim" element={<Claim />} /> */}
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
          </Route>
        </Routes>
      </Router>
      {/* ) : (
      <div className="bg-sky-50 flex flex-col md:flex-row gap-28 md:gap-5 justify-center items-center h-[95vh] lg:h-[92vh] p-10 m-5 rounded-md ">
        <div className="w-full md:w-1/2 flex gap-10 md:items-start justify-center md:justify-start xl:px-28 flex-col">
          <div className="flex flex-col gap-5 items-center md:items-start justify-center text-center md:text-start">
            <img src={logo} className="md:w-2/3" />
            <h2 className="text-lg">Welcome To Invezza HRMS Portal</h2>
          </div>
          <button
            onClick={(e) => loginWithRedirect()}
            className="bg-blue-600 px-5 py-2 rounded-md text-white md:text-base font-bold hover:bg-blue-700 xl:w-1/5"
          >
            Login
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center  ">
          <img src={Loginimg} alt="Clientlogo" className="md:w-2/3 " />
        </div>
      </div>
      )} */}
    </>
  );
}

export default App;
