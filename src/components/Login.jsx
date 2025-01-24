import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loginimg from "../../src/assets/images/login.svg";
import logo from "../../src/assets/images/invezza-logo.png";
import logodark from "../../src/assets/images/invezza-logo-darkmode.png";
import Loading from "./extra/loading";
import ErrorMsg from "./extra/ErrorMsg";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { AuthContext } from "../contexts/AuthContext";
import secureLocalStorage from "react-secure-storage";
import ApiendPonits from "../api/APIEndPoints.json";

const Login = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const { setUserData, setTokenType } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.login}`,
        {
          email,
          password,
        }
      );

      const data = response.data.data;

      // console.log(response.data);

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        secureLocalStorage.setItem("userData", JSON.stringify(data)); // Store user data in sessionStorage
        setUserData(data);
        setTokenType(response.data.tokenType); // Set tokenType in context
        navigate("/");
      } else {
        setError(response.data.msg || "Login failed");
      }
      setLoading(false);
      setError(null);
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
      <div className="dark:bg-neutral-800  bg-sky-100 flex flex-col md:flex-row gap-28 md:gap-5 justify-center items-center h-full px-3 rounded-md">
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
                  className="p-2 rounded-md dark:bg-neutral-800 bg-sky-100"
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
                    className="p-2 rounded-md dark:bg-neutral-800 bg-sky-100 w-full"
                    type={showPassword ? "password" : "text"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="dark:bg-neutral-800 bg-sky-100 text-blue-400 p-2 rounded-md cursor-pointer">
                    {showPassword ? (
                      <IoEye fontSize={22} onClick={showpass} />
                    ) : (
                      <IoEyeOff fontSize={22} onClick={showpass} />
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
                  <h5 className="hover:bg-blue-100 hover:dark:bg-neutral-800 w-fit hover:px-2 duration-500 py-1 rounded-md text-blue-500">
                    Forgot/Reset Password
                  </h5>
                </Link>
                <h5>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold hover:bg-blue-100 hover:dark:bg-neutral-800 w-fit hover:px-2 duration-500 py-1 rounded-md text-blue-500"
                  >
                    Register
                  </Link>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 hidden lg:flex justify-center">
          <img src={Loginimg} alt="Clientlogo" className="md:w-2/3" />
        </div>
      </div>
    </form>
  );
};

export default Login;

// import React, { useState, useEffect, useRef, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import Loginimg from "../../src/assets/images/login.svg";
// import logo from "../../src/assets/images/invezza-logo.png";
// import logodark from "../../src/assets/images/invezza-logo-darkmode.png";
// import Loading from "./extra/loading";
// import ErrorMsg from "./extra/ErrorMsg";
// import { IoEyeOff, IoEye } from "react-icons/io5";
// import { AuthContext } from "../contexts/AuthContext";
// import secureLocalStorage from "react-secure-storage";
// import ApiendPonits from "../api/APIEndPoints.json";
// import { BsFillShieldLockFill } from "react-icons/bs";
// import { leapfrog } from "ldrs";

// const Login = ({ theme }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(true);
//   const [showOtpPopup, setShowOtpPopup] = useState(false);
//   const [timer, setTimer] = useState(179);
//   const navigate = useNavigate();
//   const { setUserData, setTokenType } = useContext(AuthContext);
//   const inputRefs = useRef([]);

//   useEffect(() => {
//     let countdown;
//     if (showOtpPopup) {
//       countdown = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             clearInterval(countdown);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(countdown);
//   }, [showOtpPopup, timer]);

//   useEffect(() => {
//     if (showOtpPopup && inputRefs.current[0]) {
//       inputRefs.current[0].focus(); // Auto-focus the first OTP input
//     }
//   }, [showOtpPopup]);

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]$/.test(value) || value === "") {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       // Move to the next input if a digit is entered
//       if (value && index < otp.length - 1) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text").trim();

//     if (/^\d{6}$/.test(pastedData)) {
//       // Check if the pasted value is exactly 6 digits
//       const newOtp = pastedData.split("");
//       setOtp(newOtp);

//       // Move focus to the last input field
//       inputRefs.current[otp.length - 1]?.focus();
//     }
//   };

//   const handleBackspace = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { data } = await axios.post(
//         `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.login}`,
//         { email, password }
//       );

//       if (data.success) {
//         setShowOtpPopup(true);
//         setTimer(179);
//       } else {
//         setError(data.msg || "Login failed");
//         setTimeout(() => setError(null), 5000);
//       }
//     } catch (error) {
//       setError(
//         error.response?.data?.msg ||
//           "An unexpected error occurred. Please try again."
//       );
//       setTimeout(() => setError(null), 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     const enteredOtp = otp.join("");
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.verifyOtp}`,
//         { email, otp: enteredOtp }
//       );

//       const data = response.data.data;

//       if (response.data.success) {
//         localStorage.setItem("accessToken", response.data.accessToken);
//         secureLocalStorage.setItem("userData", JSON.stringify(data)); // Store user data in sessionStorage
//         setUserData(data);
//         setTokenType(response.data.tokenType); // Set tokenType in context
//         navigate("/");
//       } else {
//         setError(data.msg || "Invalid OTP. Please try again.");
//         setTimeout(() => setError(null), 5000);
//       }
//     } catch (error) {
//       setError(
//         error.response?.data?.msg ||
//           "An unexpected error occurred. Please try again."
//       );
//       setTimeout(() => setError(null), 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showpass = () => {
//     setShowPassword(!showPassword);
//   };

//   const resendcode = async () => {
//     handleSubmit();
//     setOtp(["", "", "", "", "", ""]);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-2 dark:bg-black h-screen dark:text-white"
//     >
//       <div className="dark:bg-neutral-800 bg-sky-100 flex flex-col md:flex-row gap-28 md:gap-5 justify-center items-center h-full px-3 rounded-md">
//         <div className="w-full md:w-1/2 flex flex-col gap-10 items-center justify-center">
//           <div className="flex flex-col gap-5 items-center">
//             <img
//               src={theme === "dark" ? logodark : logo}
//               className="md:w-2/3"
//               alt="logo"
//             />
//             <h2 className="text-lg text-black dark:text-white">
//               Welcome To Invezza HRMS Portal
//             </h2>
//           </div>
//           <div className="dark:bg-neutral-900 bg-white shadow-xl p-3 rounded-md flex flex-col gap-5 w-full md:w-2/3">
//             <div className="flex flex-col gap-4">
//               <div className="flex flex-col gap-1">
//                 <label>Email</label>
//                 <input
//                   className="p-2 rounded-md dark:bg-neutral-800 bg-sky-100"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label>Password</label>
//                 <div className="flex gap-2">
//                   <input
//                     className="p-2 rounded-md dark:bg-neutral-800 bg-sky-100 w-full"
//                     type={showPassword ? "password" : "text"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <div className="dark:bg-neutral-800 bg-sky-100 text-blue-400 p-2 rounded-md cursor-pointer">
//                     {showPassword ? (
//                       <IoEye fontSize={22} onClick={showpass} />
//                     ) : (
//                       <IoEyeOff fontSize={22} onClick={showpass} />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {!showOtpPopup ? (
//               <div>
//                 {error && <ErrorMsg severity="error">{error}</ErrorMsg>}
//               </div>
//             ) : (
//               ""
//             )}

//             <button
//               type="submit"
//               className="bg-blue-600 rounded-md text-white md:text-base font-bold hover:bg-blue-700 w-full flex flex-col gap-2 items-center justify-center"
//               disabled={loading}
//             >
//               <h4 className="py-2">Login</h4>
//               {!showOtpPopup ? (
//                 <div className="w-full">{loading && <Loading />}</div>
//               ) : (
//                 ""
//               )}
//             </button>
//             <div className="flex flex-col md:flex-row justify-between">
//               <Link to="/resetpassword" className="font-bold">
//                 <h5 className="hover:bg-blue-100 hover:dark:bg-neutral-800 w-fit hover:px-2 duration-500 py-1 rounded-md text-blue-500">
//                   Forgot/Reset Password
//                 </h5>
//               </Link>
//               <h5>
//                 Don't have an account?{" "}
//                 <Link
//                   to="/register"
//                   className="font-bold hover:bg-blue-100 hover:dark:bg-neutral-800 w-fit hover:px-2 duration-500 py-1 rounded-md text-blue-500"
//                 >
//                   Register
//                 </Link>
//               </h5>
//             </div>
//           </div>
//         </div>
//         <div className="w-full md:w-1/2 hidden lg:flex justify-center">
//           <img src={Loginimg} alt="Clientlogo" className="md:w-2/3" />
//         </div>
//       </div>

//       {/* Code Modal Popup */}
//       {showOtpPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xl flex justify-center items-center">
//           <div className="bg-white dark:bg-neutral-900 dark:border-2 border-neutral-600 px-4 py-10 md:py-4 rounded-lg shadow-xl max-w-sm w-full flex flex-col items-center gap-2">
//             <BsFillShieldLockFill fontSize={40} className="text-blue-500" />
//             <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
//               Verify Your Code
//             </h3>
//             <p className="text-center text-gray-600 dark:text-gray-400">
//               Please enter the Code sent to your email.
//             </p>

//             <div className="flex justify-center gap-2 mt-4">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength="1"
//                   className="w-12 h-12 text-center text-lg font-bold rounded-lg dark:bg-neutral-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   value={digit}
//                   onChange={(e) => handleOtpChange(e, index)}
//                   onKeyDown={(e) => handleBackspace(e, index)}
//                   onPaste={handlePaste}
//                   ref={(el) => (inputRefs.current[index] = el)}
//                 />
//               ))}
//             </div>
//             <button
//               onClick={handleOtpSubmit}
//               className="bg-blue-600/20 rounded-lg text-base text-blue-500 font-semibold hover:bg-blue-700/20 w-full transition duration-200 mt-10"
//               disabled={loading || timer === 0}
//             >
//               {loading ? (
//                 <div className="py- mt-2.5">
//                   <l-leapfrog
//                     size="40"
//                     speed="2.5"
//                     color="#285999"
//                   ></l-leapfrog>
//                 </div>
//               ) : (
//                 <h4 className="py-3">Verify Code</h4>
//               )}
//             </button>
//             <div className="flex gap-2 w-full justify-between">
//               {/* timer */}
//               <p
//                 className={`text-center font-bold flex gap-1 ${
//                   timer > 120
//                     ? "text-green-500" // More than 2 minutes
//                     : timer > 60
//                     ? "text-yellow-500" // More than 1 minute
//                     : timer > 20
//                     ? "text-orange-500" // More than 20 seconds
//                     : "text-red-500" // Less than 20 seconds
//                 }`}
//               >
//                 <div>
//                   {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
//                 </div>
//                 {timer < 60 ? "Sec " : "Min "}
//                 remaining
//               </p>
//               {/* resend code */}
//               <p>
//                 Don't get Code?
//                 <button
//                   onClick={resendcode}
//                   className="text-blue-600 font-bold hover:px-1 hover:bg-blue-500/20 duration-500 rounded-md"
//                 >
//                   Resend
//                 </button>
//               </p>
//             </div>
//             {error && (
//               <div className="text-red-500 bg-red-500/20 py-2 w-full rounded-md text-center">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </form>
//   );
// };

// export default Login;
