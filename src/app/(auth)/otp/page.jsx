"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOTP, resendOTP } from "@/lib/authService";
import Image from "next/image";
import InvestHomeLogo from "../../../../public/images/logo.png";
import Link from "next/link";
import X_Icon from "../../../../public/icons/x.svg";
import ProtectedLayout from "@/components/router/ProtectedLayout";
import MessageModal from "@/components/ui/MessageModal";

const OTPPage = () => {
  const inputRefs = useRef([]);
  const [values, setValues] = useState(["", "", "", ""]);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const router = useRouter();

  // const otp = localStorage.getItem("otp") || "";
  useEffect(() => {
    if (typeof window !== "undefined") {
      const otp = localStorage.getItem("otp") || "";
      if (otp.length === 4) {
        setValues(otp.split(""));
        setIsButtonActive(true);
      }
    }
  }, []);
  const handleVerify = async () => {
    try {
      const res = await verifyOTP(values.join(""));
      console.log("bls");

      const token = res.token;

      if (token) {
        localStorage.setItem("access-token", token);
        setModal({
          open: true,
          variant: "success",
          title: "Uğurlu",
          message: "Giriş uğurlu!",
        });
      } else {
        setModal({
          open: true,
          variant: "error",
          title: "Xəta",
          message: "Token alınmadı!",
        });
      }
    } catch (error) {
      setModal({
        open: true,
        variant: "error",
        title: "Xəta",
        message: "OTP xətası: " + (error?.response?.data?.message || "Xəta baş verdi"),
      });
    }
  };

  const handleResend = async () => {
    const res = await resendOTP();
    setValues(String(res).split(""));
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

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValues = [...values];

      if (newValues[index] !== "") {
        newValues[index] = "";
        setValues(newValues);
        setIsButtonActive(false);
      } else if (index > 0) {
        newValues[index - 1] = "";
        setValues(newValues);

        for (let i = index; i < values.length; i++) {
          inputRefs.current[i].setAttribute("disabled", true);
        }

        inputRefs.current[index - 1].focus();
        setIsButtonActive(false);
      }
    }
  };
  useEffect(() => {
    console.log(values);
  }, []);

  return (
    <ProtectedLayout>
      <MessageModal
        isOpen={modal.open}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        primaryText={modal.variant === "success" ? "Davam et" : "Bağla"}
        onPrimary={() => {
          setModal((prev) => ({ ...prev, open: false }));
          if (modal.variant === "success") router.push("/");
        }}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />

      <section className="min-[431px]:bg-primary min-h-screen min-[431px]:text-white text-center min-[431px]:flex min-[431px]:items-center">
        <div className="max-w-[1600px] mx-auto py-5 px-20 max-[1025px]:px-5 max-[431px]:px-4 flex flex-col gap-9">
          <div className="min-[1024px]:hidden flex justify-between items-center">
            <div className="flex gap-[7px] items-center font-semibold text-[18px]">
              <Image
                src={"/images/logo.png"}
                alt="Invest Home Logo"
                width={50}
                height={50}
                priority
                className="shrink-0"
              />
              <span>Invest Home</span>
            </div>
            <Link href={"/"}>
              <div className="w-6 h-6 flex items-center justify-center">
                <Image src={X_Icon} width={13} height={13} alt="x_icon" />
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-10">
            <div className="max-[431px]:hidden flex flex-col items-center gap-3">
              <Image
                src={InvestHomeLogo}
                width={100}
                height={100}
                className="rounded-full"
                alt="logo"
              />
              <span className=" text-[20px] font-medium">Invest Home</span>
            </div>
            <h1 className="max-[431px]:hidden text-[36px] font-semibold">
              "Yeni evinizi tapmağa bir addım yaxınsınız"
            </h1>
            <div className="flex flex-col gap-7">
              <h2 className="text-[24px] font-semibold">Giriş kodu</h2>
              <p>
                Zəhmət olmasa, emailinizə göndərilən 4 rəqəmli təsdiq kodunu
                aşağıya daxil edin.
              </p>
            </div>
            <form className="remove-arrow">
              <div className="flex items-center justify-center gap-4">
                {values.map((val, index) => (
                  <input
                    style={{ caretColor: "transparent", userSelect: "none" }}
                    key={index}
                    type="number"
                    placeholder="_"
                    className="w-12 h-12 p-[17px] rounded-lg border-2 border-neutral max-[431px]:border-primary bg-transparent text-[19px] text-neutral-text max-[431px]:text-[black] text-center focus:outline-none placeholder:text-neutral-text min-[431px]:disabled:border-[#8a8b8c] disabled:border-[#E1E6EF]"
                    value={val}
                    ref={(el) => (inputRefs.current[index] = el)}
                    disabled={index !== 0 && values[index - 1] === ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
            </form>
            <div className="flex flex-col gap-10 items-center">
              <button
                disabled={seconds > 0 || minutes > 0}
                onClick={handleResend}
              >
                <span className="select-none cursor-pointer max-[431px]:text-primary text-white text-[16px] font-medium text-center">
                  Kodu yenidən göndər{" "}
                  {seconds > 0 || minutes > 0
                    ? `(${minutes}:${seconds < 10 ? `0${seconds}` : seconds})`
                    : ""}
                </span>
              </button>
              <button
                className="cursor-pointer max-w-[361px] py-[11px] w-full rounded-lg border border-white text-[16px] max-[431px]:text-white max-[431px]:bg-primary"
                onClick={handleVerify}
                disabled={!isButtonActive}
              >
                Daxil ol
              </button>
            </div>
          </div>
        </div>
      </section>
    </ProtectedLayout>
  );
};

export default OTPPage;
