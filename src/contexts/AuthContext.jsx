import React, { createContext, useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [tokenType, setTokenType] = useState(null);

  useEffect(() => {
    const storedUserData = secureLocalStorage.getItem("userData");
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
