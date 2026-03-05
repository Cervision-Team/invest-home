"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("apolloLogin");

    if (loggedIn === "true") {
      setAuthorized(true); // kontenti göstər
    } else {
      setAuthorized(false);
      router.push("/login-program"); // login page yönləndir
    }
  }, [router]);

  if (!authorized) return null; // yönləndirmə bitənə qədər heç nə göstərmə

  return <>{children}</>; // auth varsa kontent göstər
}
