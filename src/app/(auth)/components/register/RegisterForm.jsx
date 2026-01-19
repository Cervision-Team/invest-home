"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authService";
import Image from "next/image";
// import Mail from "../../../../../public/icons/mail.svg";
import Link from "next/link";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { emailSchema, passwordSchema } from "@/lib/schemas/authSchemas";


const ERROR_CODE = {
  EMAIL_ALREADY_EXIST: "Bu email mövcuddur",
  PHONE_NUMBER_ALREADY_EXIST: "Bu nömrə mövcuddur",
}

const schema = yup.object({
  fullName: yup
    .string()
    .required("Ad soyad vacibdir")
    .test(
      "two-words",
      "Zəhmət olmasa həm ad, həm soyad daxil edin",
      (v) => v && v.trim().split(" ").length >= 2
    ),
  email: emailSchema,
  password: passwordSchema,
  terms: yup.boolean().oneOf([true], "Zəhmət olmasa şərtləri qəbul edin"),
});

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("otp", res);
      localStorage.setItem("email", data.email);
      localStorage.setItem("entranceType", "SIGNUP");
      router.replace("/otp");
    } catch (err) {
      const errorResponse = err.response.data.message
      const errorMessage = ERROR_CODE[errorResponse]
      const errorIndex = Object.keys(ERROR_CODE).indexOf(errorResponse);

      switch (errorIndex) {
        case 0:
        case 1:
        case 2:
          setError("email", {
            type: "server",
            message: errorMessage
          });
          break
        default:
          console.log("Unknown backend error:", errorResponse);
          break;
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName" className="text-sm font-medium text-black">
            Ad Soyad<span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Ad soyadınızı daxil edin"
            {...register("fullName")}
            className="border border-black p-2 rounded-md text-base placeholder:pl-2"
          />
          <div className="h-[28px] text-sm text-red-500">
            {errors.fullName?.message}
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-[4px]">
          <label htmlFor="email" className="text-sm font-medium text-black">
            Email<span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              id="email"
              type="email"
              placeholder="Email daxil edin"
              {...register("email")}
              className="w-full border border-black p-2 rounded-md text-base placeholder:pl-2"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {/* <Image src={Mail.src} alt="mail" width={20} height={20} /> */}
              <Mail size={20} />
            </span>
          </div>
          <div className="h-[28px] text-sm text-red-500">
            {errors.email?.message}
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[4px]">
          <label htmlFor="password" className="text-sm font-medium text-black">
            Şifrə<span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrənizi daxil edin"
                  className="w-full border border-black p-2 rounded-md text-base placeholder:pl-2"
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="h-[28px] text-sm text-red-500">
            {errors.password?.message}
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[4px]">
          <div className="flex items-center gap-2.5">
            <input
              id="terms"
              type="checkbox"
              {...register("terms")}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-base text-black cursor-pointer"
            >
              <Link href={"/terms-and-conditions"}>
                <span className="text-primary hover:text-green-800">
                  Şərtlər və qaydaları
                </span>{" "}
              </Link>
              oxudum, razıyam.
            </label>
          </div>
          <div className="h-[28px] text-sm text-red-500">
            {errors.terms?.message}
          </div>
        </div>

        <div className="mt-[4px] flex flex-col gap-6">
          <button
            type="submit"
            className="cursor-pointer w-full bg-primary text-white py-3 px-6 rounded-lg hover:opacity-90"
          >
            Qeydiyyatdan keç
          </button>

          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-full bg-[#866AB4]" />
            <span className="text-sm text-1 whitespace-nowrap">və ya</span>
            <span className="h-px w-full bg-[#866AB4]" />
          </div>

          <GoogleLoginButton />
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
