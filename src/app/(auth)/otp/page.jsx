"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOTP, resendOTP } from "@/lib/authService";
import { toast } from "react-toastify";
// import { LoginSignupButtonWithHover } from "@/components/ui/LoginSignupButton";
import Image from "next/image";
import InvestHomeLogo from "../../../../public/images/logo.png"

const OTPPage = () => {
  const inputRefs = useRef([]);
  const [values, setValues] = useState(["", "", "", ""]);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    const otp = values.join("");

    try {
      const response = await verifyOTP(otp);
      const token = response.token;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Giriş uğurlu!");
        router.push("/");
      } else {
        toast.error("Token alınmadı!");
      }
    } catch (error) {
      toast.error(
        "OTP xətası: " + (error?.response?.data?.message || "Xəta baş verdi")
      );
    }
  };

  const handleResend = async () => {
    await resendOTP();
    setMinutes(1);
    setSeconds(0);
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds((s) => s - 1);
      } else if (minutes > 0) {
        setMinutes((m) => m - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, minutes]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (val.length > 1) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    if (val !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].removeAttribute("disabled");
      inputRefs.current[index + 1].focus();
    }

    setIsButtonActive(newValues.every((v) => v !== ""));
  };

  const handleKeyUp = (e, index) => {
    if (e.key === "Backspace") {
      const newValues = [...values];
      if (index > 0 && newValues[index] === "") {
        for (let i = index; i < values.length; i++) {
          newValues[i] = "";
          inputRefs.current[i].setAttribute("disabled", true);
        }
        inputRefs.current[index - 1].focus();
      } else {
        newValues[index] = "";
      }
      if (index > 0) inputRefs.current[index - 1].focus();
      setValues(newValues);
      setIsButtonActive(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary pt-[30px] flex flex-col items-center justify-center relative">
      <div className="flex flex-col items-center gap-[30px] px-[405px]">
        <div className="flex flex-col items-center">
          <Image
            src={InvestHomeLogo}
            alt="Invest Home Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
          <p className="text-white text-[20px] font-semibold main-logo-style">INVEST HOME</p>
        </div>
        <p className="text-white text-center text-[36px] font-semibold">
          “Yeni evinizi tapmağa bir addım yaxınsınız”
        </p>
      </div>

      <div className="flex flex-col items-center gap-[28px] px-[513px] mt-[60px]">
        <p className="text-white text-center text-[24px] font-medium">
          Giriş kodu
        </p>
        <p className="text-white text-center text-[14px]">
          Zəhmət olmasa, nömrənizə göndərilən 4 rəqəmli təsdiq kodunu aşağıya
          daxil edin.
        </p>
      </div>

      <form className="remove-arrow mt-[40px]">
        <div className="flex items-center justify-center gap-[16px]">
          {values.map((val, index) => (
            <input
              key={index}
              type="number"
              placeholder="_"
              className="w-[48px] h-[48px] p-[17px] rounded-[8px] border-2 border-neutral bg-transparent text-[19px] text-neutral-text text-center focus:outline-none placeholder:text-neutral-text disabled:border-[#8a8b8c]"
              value={val}
              ref={(el) => (inputRefs.current[index] = el)}
              disabled={index !== 0 && values[index - 1] === ""}
              onChange={(e) => handleChange(e, index)}
              onKeyUp={(e) => handleKeyUp(e, index)}
            />
          ))}
        </div>
      </form>

      <div className="mt-[40px]">
        <button disabled={seconds > 0 || minutes > 0} onClick={handleResend}>
          <p className="text-white text-[16px] font-medium text-center">
            Kodu yenidən göndər{" "}
            {seconds > 0 || minutes > 0
              ? `(${minutes}:${seconds < 10 ? `0${seconds}` : seconds})`
              : ""}
          </p>
        </button>
      </div>

      <div className="mt-[50px]">
        <button onClick={handleVerify} disabled={!isButtonActive}>
          {/* <LoginSignupButtonWithHover actionName="Daxil ol" /> */}
        </button>
      </div>

      {/* SVG-ləri eyni qaydada saxladım. Əgər fayl çox şişirsə, komponent kimi ayıra bilərik. */}
    </div>
  );
};

export default OTPPage;
