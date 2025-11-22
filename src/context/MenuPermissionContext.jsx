"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getMenu } from "@/services/api/endpoints/menuService";

const MenuPermissionContext = createContext({
  menuPermission: [],
  fetchMenuPermission: () => {},
});

export const MenuPermissionProvider = ({ children }) => {
  const [menuPermission, setMenuPermission] = useState([]);

  const fetchMenuPermission = async () => {
    console.log("islediye");
    
    const res = await getMenu();
    setMenuPermission(res);
    console.log(menuPermission);
    
  };
  console.log(menuPermission);
  
  useEffect(() => {
    fetchMenuPermission();
  }, []);

  return (
    <MenuPermissionContext.Provider value={{ menuPermission, fetchMenuPermission }}>
      {children}
    </MenuPermissionContext.Provider>
  );
};

export const useMenuPermission = () => useContext(MenuPermissionContext);
