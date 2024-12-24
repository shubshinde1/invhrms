import React from "react";
// import { , useRouteMatch } from "react-router-dom";
import {
  BrowserRouter as useRouteMatch,
  Route,
  Routes,
} from "react-router-dom";
import Employeelist from "./pim/Employeelist";
import Loginimg from "../../src/assets/images/login.svg";
import logo from "../../src/assets/images/invezza-logo.png";

import Addemployee from "./pim/Addemployee";
import MenuTabs from "./pim/Menutabs";

export default function Pim() {
  const match = useRouteMatch("/pim");

  return (
    <div className=" h-full ">
      {/* <MenuTabs /> */}
      {/* <Routes>
        <Route path="/pim" render={() => <Addemployee match={!!match} />} />
      </Routes> */}
      <Employeelist />
    </div>
  );
}
