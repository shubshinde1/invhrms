// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Loginimg from "../../src/assets/images/login.svg";
import logo from "../../src/assets/images/invezza-logo.png";
import logodark from "../../src/assets/images/invezza-logo-darkmode.png";
import { Link } from "react-router-dom";
import Loading from "./extra/loading";
import ErrorMsg from "./extra/ErrorMsg";
import axios from "axios";

const Login = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:4000/api/login",
        {
          email,
          password,
        },
        config
      );

      login(data); // Pass the entire response data to the login function
      setLoading(false);

      navigate("/"); // Redirect to the dashboard or any other protected route
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.msg || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 dark:bg-black h-screen dark:text-white"
    >
      <div className="dark:bg-neutral-800 bg-sky-100 flex flex-col md:flex-row gap-28 md:gap-5 justify-center items-center h-full px-5 rounded-md ">
        <div className="w-full md:w-1/2 flex flex-col gap-10 items-center justify-center ">
          <div className="flex flex-col gap-5 items-center ">
            {theme === "dark" ? (
              <img src={logodark} className="md:w-2/3" alt="logo" />
            ) : (
              <img src={logo} className="md:w-2/3" alt="logo" />
            )}
            <h2 className="text-lg text-black dark:text-white">
              Welcome To Invezza HRMS Portal
            </h2>
          </div>
          <div className="dark:bg-neutral-900 bg-white shadow-xl p-3 rounded-md flex flex-col gap-5 w-full md:w-2/3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label>Email:</label>
                <input
                  className="p-2 rounded-md dark:bg-neutral-700 bg-sky-100"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Password:</label>
                <input
                  className="p-2 rounded-md dark:bg-neutral-700 bg-sky-100"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {error && <ErrorMsg severity="error">{error}</ErrorMsg>}

              <button
                type="submit"
                className="bg-blue-600 rounded-md text-white md:text-base font-bold hover:bg-blue-700 w-full flex flex-col gap-2 items-center justify-center"
              >
                <h4 className="py-2">Login</h4>
                {loading && <Loading />}
              </button>
              <div className="flex flex-col md:flex-row justify-between">
                <h5>
                  <button className="text-blue-500 font-bold">
                    Forgot Password
                  </button>
                </h5>
                <h5>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-500 font-bold">
                    Register
                  </Link>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={Loginimg} alt="Clientlogo" className="md:w-2/3" />
        </div>
      </div>
    </form>
  );
};

export default Login;
