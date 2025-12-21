"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getMenu } from "@/services/api/endpoints/menuService";

const MenuPermissionContext = createContext({
  menuPermission: [],
  fetchMenuPermission: () => {},
  menuLoading: false,
  menuLoaded: false,
});

export const MenuPermissionProvider = ({ children }) => {
  const [menuPermission, setMenuPermission] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const isFetchingMenu = useRef(false);
  const hasFetchedMenu = useRef(false);

  const fetchMenuPermission = useCallback(async () => {
    if (isFetchingMenu.current || hasFetchedMenu.current) return;
    isFetchingMenu.current = true;
    setMenuLoading(true);
    try {
      const res = await getMenu();
      setMenuPermission(res ?? []);
    } catch (err) {
      console.log(err);
      setMenuPermission([]);
    } finally {
      setMenuLoading(false);
      setMenuLoaded(true);
      isFetchingMenu.current = false;
      hasFetchedMenu.current = true;
    }
  }, []);

  useEffect(() => {
    const isToken = Boolean(typeof window !== "undefined" && localStorage.getItem("access-token"));
    if (isToken) {
      fetchMenuPermission();
    }
  }, [fetchMenuPermission]);

  return (
    <MenuPermissionContext.Provider
      value={{ menuPermission, fetchMenuPermission, menuLoading, menuLoaded }}
    >
      {children}
    </MenuPermissionContext.Provider>
  );
};

export const useMenuPermission = () => useContext(MenuPermissionContext);
