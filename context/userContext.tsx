import React, { createContext, useContext, useState } from "react";

export interface UserContextType {
  fname: string;
  lname: string;
  role: string;
  setUser: (fname: string, lname: string, role: string) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [role, setRole] = useState<string>("")

  // Function to set user data
  const setUser = (fname: string, lname: string) => {
    setFname(fname);
    setLname(lname);
    setRole(role);
  };

  // Function to clear user data
  const clearUser = () => {
    setFname("");
    setLname("");
    setRole("");
  };

  return (
    <UserContext.Provider value={{ fname, lname, role, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};