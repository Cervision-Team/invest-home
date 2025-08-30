"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOTP, resendOTP } from "@/lib/authService";
import { toast } from "react-toastify";
import Image from "next/image";
import InvestHomeLogo from "../../../../public/images/logo.png"
import Link from "next/link";
import X_Icon from "../../../../public/icons/x.svg"

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
    <section className="min-[431px]:bg-primary min-h-screen min-[431px]:text-white text-center min-[431px]:flex min-[431px]:items-center">

      <div className="max-w-[1600px] mx-auto py-[20px] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] flex flex-col gap-[36px]">
        <div className="min-[1024px]:hidden flex justify-between items-center">
          <div className="flex gap-[7px] items-center font-[600] text-[18px]">
            <Image
              src={"/images/logo.png"}
              alt="Invest Home Logo"
              width={50}
              height={50}
              priority
              className="flex-shrink-0"
            />
            <span>Invest Home</span>
          </div>
          <Link href={"/"}>
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              <Image
                src={X_Icon}
                width={13}
                height={13}
                alt='x_icon'
              />
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-[40px]">
          <div className="max-[431px]:hidden flex flex-col items-center gap-[12px]">
            <Image
              src={InvestHomeLogo}
              width={100}
              height={100}
              className="rounded-full"
              alt="logo"
            />
            <span className=" text-[20px] font-[500]">Invest Home</span>
          </div>
          <h1 className="max-[431px]:hidden text-[36px] font-[600]">
            “Yeni evinizi tapmağa bir addım yaxınsınız”
          </h1>
          <div className="flex flex-col gap-[28px]">
            <h2 className="text-[24px] font-[600]">Giriş kodu</h2>
            <p>Zəhmət olmasa, nömrənizə göndərilən 4 rəqəmli təsdiq kodunu aşağıya daxil edin.</p>
          </div>
          <form className="remove-arrow">
            <div className="flex items-center justify-center gap-[16px]">
              {values.map((val, index) => (
                <input
                  style={{ caretColor: "transparent", userSelect: "none" }}
                  key={index}
                  type="number"
                  placeholder="_"
                  className="w-[48px] h-[48px] p-[17px] rounded-[8px] border-2 border-neutral max-[431px]:border-primary bg-transparent text-[19px] text-neutral-text max-[431px]:text-[black] text-center focus:outline-none placeholder:text-neutral-text min-[431px]:disabled:border-[#8a8b8c] disabled:border-[#E1E6EF]"
                  value={val}
                  ref={(el) => (inputRefs.current[index] = el)}
                  disabled={index !== 0 && values[index - 1] === ""}
                  onChange={(e) => handleChange(e, index)}
                  onKeyUp={(e) => handleKeyUp(e, index)}
                />
              ))}
            </div>
          </form>
          <div className="flex flex-col gap-[40px] items-center">
            <button disabled={seconds > 0 || minutes > 0} onClick={handleResend}>
              <span className="select-none cursor-pointer max-[431px]:text-primary text-white text-[16px] font-medium text-center">
                Kodu yenidən göndər{" "}
                {seconds > 0 || minutes > 0
                  ? `(${minutes}:${seconds < 10 ? `0${seconds}` : seconds})`
                  : ""}
              </span>
            </button>
            <button className="cursor-pointer max-w-[361px] py-[11px] w-full rounded-[8px] border-[1px] border-white text-[16px] max-[431px]:text-white max-[431px]:bg-primary">Daxil ol</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTPPage;
