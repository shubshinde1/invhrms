// import React, { createContext, useState, useEffect } from "react";
// import secureLocalStorage from "react-secure-storage";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);
//   const [tokenType, setTokenType] = useState(null);

//   useEffect(() => {
//     const storedUserData = secureLocalStorage.getItem("userData");
//     if (storedUserData) {
//       const parsedData = JSON.parse(storedUserData);
//       setUserData(parsedData);
//       setTokenType(parsedData.tokenType); // Assuming tokenType is stored in userData
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ userData, setUserData, tokenType, setTokenType }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [tokenType, setTokenType] = useState(null);

  useEffect(() => {
    const storedUserData = secureLocalStorage.getItem("userData");

    if (storedUserData) {
      let parsedData;

      // Check if stored data is a string that can be parsed
      if (typeof storedUserData === "string") {
        try {
          parsedData = JSON.parse(storedUserData);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          return;
        }
      } else {
        // If stored data is already an object, no need to parse
        parsedData = storedUserData;
      }

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
