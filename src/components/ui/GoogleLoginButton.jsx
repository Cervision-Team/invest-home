"use client";

import Google from "../../../public/icons/google.svg"
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginWithGoogle } from "@/lib/authService";


export default function GoogleLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startGoogleLogin = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        console.log(tokenResponse);
        
        const data = await loginWithGoogle(tokenResponse?.access_token);

        const token = data?.token;
        if (token) {
          localStorage.setItem("access-token", token);
          router.replace("/");
          return;
        }
      } catch (err) {
        console.error("Google login error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login failed:", err);
      setIsLoading(false);
    },
  });

  return (
    <button
      type="button"
      onClick={() => {
        if (!isLoading) startGoogleLogin();
      }}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 border border-primary text-[#1B1F27] py-3 rounded-lg hover:bg-green-50 cursor-pointer disabled:opacity-60"
    >
      <Image
        src={Google.src}
        alt="Google"
        width={20}
        height={20}
      />
      <span className="font-medium">Sign up with Google</span>
    </button>
     
  );
}