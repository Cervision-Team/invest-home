"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getUser } from "@/services/api/endpoints/userService";

const UserContext = createContext({
  user: null,
  userLoading: false,
  fetchUser: () => Promise.resolve(null),
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const isFetching = useRef(false);
  const cachedUser = useRef(null);
  const pendingPromise = useRef(null);

  const fetchUser = useCallback(async (options = {}) => {
    const force = Boolean(options?.force);

    if (force) {
      cachedUser.current = null;
      pendingPromise.current = null;
    }

    if (!force && cachedUser.current) return cachedUser.current;
    if (!force && pendingPromise.current) return pendingPromise.current;
    isFetching.current = true;
    setUserLoading(true);

    const promise = getUser()
      .then((res) => {
        cachedUser.current = res?.data ?? null;
        setUser(cachedUser.current);
        return cachedUser.current;
      })
      .catch((err) => {
        console.log(err);
        cachedUser.current = null;
        setUser(null);
        return null;
      })
      .finally(() => {
        isFetching.current = false;
        setUserLoading(false);
        pendingPromise.current = null;
      });

    pendingPromise.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    const isToken = Boolean(typeof window !== "undefined" && localStorage.getItem("access-token"));
    if (isToken && !cachedUser.current && !isFetching.current) {
      fetchUser();
    }
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, userLoading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
