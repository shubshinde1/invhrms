import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loginimg from "../../src/assets/images/login.svg";
import logo from "../../src/assets/images/invezza-logo.png";
import logodark from "../../src/assets/images/invezza-logo-darkmode.png";
import Loading from "./extra/loading";
import ErrorMsg from "./extra/ErrorMsg";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext
import Cookies from "js-cookie";

const Login = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const { setUserData } = useContext(AuthContext); // Access setUserData from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });

      const data = response.data.data;

      console.log(response.data);

      if (response.data.success) {
        // Set logged-in status to true
        const localToken = localStorage.setItem(
          "accessToken",
          response.data.accessToken
        );
        // localStorage.setItem("userData", JSON.stringify(data));
        Cookies.set("userData", JSON.stringify(data), { expires: 5 });
        setUserData(data); // Set user data in context
        // Redirect to home page after successful login
        navigate("/");
      } else {
        setError(response.data.msg || "Login failed");
      }
      setLoading(false);
      setError(null); // Clear previous error state
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.msg || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const showpass = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 dark:bg-black h-screen dark:text-white"
    >
      <div className="dark:bg-neutral-800 bg-sky-100 flex flex-col md:flex-row gap-28 md:gap-5 justify-center items-center h-full px-5 rounded-md">
        <div className="w-full md:w-1/2 flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col gap-5 items-center">
            <img
              src={theme === "dark" ? logodark : logo}
              className="md:w-2/3"
              alt="logo"
            />
            <h2 className="text-lg text-black dark:text-white">
              Welcome To Invezza HRMS Portal
            </h2>
          </div>
          <div className="dark:bg-neutral-900 bg-white shadow-xl p-3 rounded-md flex flex-col gap-5 w-full md:w-2/3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label>Email</label>
                <input
                  className="p-2 rounded-md dark:bg-neutral-700 bg-sky-100"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Password</label>
                <div className="flex gap-2">
                  <input
                    className="p-2 rounded-md dark:bg-neutral-700 bg-sky-100 w-full"
                    type={showPassword ? "password" : "text"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="bg-sky-100 text-blue-600 p-2 rounded-md cursor-pointer">
                    {showPassword ? (
                      <IoEye fontSize={22} onMouseDown={showpass} />
                    ) : (
                      <IoEyeOff
                        fontSize={22}
                        onMouseUp={showpass}
                        className="text-blue-400"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {error && <ErrorMsg severity="error">{error}</ErrorMsg>}
              <button
                type="submit"
                className="bg-blue-600 rounded-md text-white md:text-base font-bold hover:bg-blue-700 w-full flex flex-col gap-2 items-center justify-center"
                disabled={loading}
              >
                <h4 className="py-2">Login</h4>
                {loading && <Loading />}
              </button>
              <div className="flex flex-col md:flex-row justify-between">
                <Link to="/resetpassword" className=" font-bold">
                  <h5 className="hover:bg-blue-100 w-fit px-2 py-1 rounded-md text-blue-500">
                    Forgot Password
                  </h5>
                </Link>
                <h5>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold hover:bg-blue-100 w-fit px-2 py-1 rounded-md text-blue-500"
                  >
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
