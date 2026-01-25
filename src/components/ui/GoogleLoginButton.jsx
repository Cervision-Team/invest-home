"use client";

// import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { loginWithGoogle } from "@/lib/authService";
import { GoogleLogin } from "@react-oauth/google";


export default function GoogleLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const update = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      if (next > 0) setMeasuredWidth(next);
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const buttonWidth = useMemo(() => {
    if (!measuredWidth) return 0;
    return Math.min(measuredWidth, 520);
  }, [measuredWidth]);

  // const startGoogleLogin = useGoogleLogin({
  //   scope: "openid email profile",
  //   flow: 'implicit',
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       setIsLoading(true);
  //       console.log(tokenResponse);

  //       const googleToken = tokenResponse?.access_token;
  //       if (!googleToken) return;

  //       const data = await loginWithGoogle(googleToken);
  //       console.log("Google login response data:", data);

  //       const token = data?.token;
  //       if (token) {
  //         localStorage.setItem("access-token", token);
  //         router.replace("/");
  //         return;
  //       }
  //     } catch (err) {
  //       console.error("Google login error:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   onError: (err) => {
  //     console.error("Google login failed:", err);
  //     setIsLoading(false);
  //   },
  // });

  return (
    <div ref={containerRef} className="w-full">
      {buttonWidth ? (
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              setIsLoading(true);

              const idToken = credentialResponse?.credential;
              if (!idToken) return;

              const data = await loginWithGoogle(idToken);
              const token = data?.token;
              if (token) {
                localStorage.setItem("access-token", token);
                router.replace("/");
                return;
              }

              console.error("Google login: token not found in response", data);
            } catch (err) {
              console.error("Google login error:", err);
            } finally {
              setIsLoading(false);
            }
          }}
          onError={() => {
            console.log("Google login failed");
            setIsLoading(false);
          }}
          width={buttonWidth}
          size="large"
          text="signin_with"
          useOneTap
        />
      ) : (
        <div className="h-11 w-full rounded-lg border border-black/15 bg-black/5" />
      )}
    </div>

  );
}