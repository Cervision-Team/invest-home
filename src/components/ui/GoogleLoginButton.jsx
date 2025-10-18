"use client";

import { useEffect } from "react";

export default function GoogleLoginButton() {
  useEffect(() => {
    const initializeGoogleButton = () => {
      if (!window.google) {
        console.log("Google Identity Services not loaded yet.");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginDiv"),
        { theme: "outline", size: "large", width: "360" }
      );
    };

    const handleGoogleResponse = async (response) => {
      const token = response.credential;
      console.log("JWT Token received");

      try {
        const res = await fetch(
          `http://172.25.96.20:8081/api/auth/public/login/with/google?idToken=${encodeURIComponent(token)}`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
            },
            mode: 'cors', // Explicitly set CORS mode
          }
        );

        const contentType = res.headers.get("content-type");
        let data;
        
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          data = await res.text();
        }

        if (!res.ok) {
          console.error("Backend error:", data);
          alert(`Login failed: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        console.log("Backend response:", data);
        
        // Handle successful login
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          window.location.href = '/dashboard';
        }
        
      } catch (err) {
        console.error("Login error:", err);
      }
    };

    if (window.google) {
      initializeGoogleButton();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleButton;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="googleLoginDiv"></div>;
}