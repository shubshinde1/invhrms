import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Auth0Provider
      domain="dev-at57wyi3mkj02gw5.us.auth0.com"
      clientId="dHENpGHR8qM4AUrYH2tbOjvMYXZAYIrS"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    > */}
    <App />
    {/* </Auth0Provider> */}
  </React.StrictMode>
);

reportWebVitals();
