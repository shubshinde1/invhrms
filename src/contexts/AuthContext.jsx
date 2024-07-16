// import React, { createContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const storedUserData = Cookies.get("userData");
//     if (storedUserData) {
//       setUserData(JSON.parse(storedUserData));
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [tokenType, setTokenType] = useState(null);

  useEffect(() => {
    const storedUserData = Cookies.get("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setTokenType(parsedData.tokenType); // Assuming tokenType is stored in userData
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, tokenType, setTokenType }}
    >
      {children}
    </AuthContext.Provider>
  );
};
