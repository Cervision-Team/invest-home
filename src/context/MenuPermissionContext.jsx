"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getMenu } from "@/services/api/endpoints/menuService";

const MenuPermissionContext = createContext({
  menuPermission: [],
  fetchMenuPermission: () => { },
});

export const MenuPermissionProvider = ({ children }) => {
  const [menuPermission, setMenuPermission] = useState([]);

  const fetchMenuPermission = async () => {
    const res = await getMenu();
    setMenuPermission(res);
  };

  useEffect(() => {
    const isToken = Boolean(localStorage.getItem("access-token"));
    if (isToken) {
      fetchMenuPermission();
    }
  }, []);

  return (
    <MenuPermissionContext.Provider value={{ menuPermission, fetchMenuPermission }}>
      {children}
    </MenuPermissionContext.Provider>
  );
};

export const useMenuPermission = () => useContext(MenuPermissionContext);
