"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/authService";
import Image from "next/image";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
// import Mail from "../../../../../public/icons/mail.svg";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { loginSchema } from "@/lib/schemas/authSchemas";
import Link from "next/link";

const ERROR_CODE = {
  USER_NOT_FOUND_BY_NUMBER: "Nömrə təyin olunmayıb",
  USER_NOT_FOUND_BY_EMAIL: "Email təyin olunmayıb",
  PASSWORD_DONT_MATCH: "Şifrə yanlışdır",
  EMAIL_OR_PASSWORD_INCORRECT: "Email və ya şifrə yanlışdır"
}

const AUTH_INVALID_CREDENTIALS_CODES = new Set([
  "USER_NOT_FOUND_BY_NUMBER",
  "USER_NOT_FOUND_BY_EMAIL",
  "PASSWORD_DONT_MATCH",
  "EMAIL_OR_PASSWORD_INCORRECT",
  "INVALID_LOGIN_OR_PASSWORD",
]);

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await loginWithEmail({ email: data.email, password: data.password });

      const token = res?.token;
      // console.log(token);

      if (token) {
        localStorage.setItem("access-token", token);
        localStorage.setItem("email", data.email);
        router.replace("/");
        return;
      }

      const otp =
        typeof res === "string" || typeof res === "number"
          ? String(res)
          : String(res?.otp ?? "");

      if (otp && otp.length === 4) {
        localStorage.setItem("otp", otp);
      } else {
        localStorage.removeItem("otp");
      }
      localStorage.setItem("email", data.email);
      localStorage.setItem("entranceType", "LOGIN");

      if (otp && otp.length === 4) {
        router.replace("/otp");
        return;
      }

      const backendCode = res?.message;
      if (backendCode && AUTH_INVALID_CREDENTIALS_CODES.has(backendCode)) {
        setServerError("Email və ya şifrə yanlışdır");
        return;
      }

      if (backendCode) {
        console.log("Unknown backend error:", backendCode);
      }
    } catch (err) {
      const backendCode = err?.response?.data?.message;
      if (backendCode && AUTH_INVALID_CREDENTIALS_CODES.has(backendCode)) {
        setServerError("Email və ya şifrə yanlışdır");
        return;
      }
      if (backendCode) {
        console.log("Unknown backend error:", backendCode);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <div className="flex flex-col gap-[27px]">
        {serverError ? (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-red-300 text-red-600">!</span>
            <span>{serverError}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-black">
            Email<span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              id="email"
              type="email"
              placeholder="Email daxil edin"
              {...register("email")}
              className="h-11 px-4 border border-black w-full text-base rounded-lg"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail size={20} />
            </span>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-1">
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

          <div className="mt-2 flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:opacity-90"
            >
              Şifrəmi unutdum
            </Link>
          </div>


          <div className="h-7 text-sm text-red-500">
            {errors.password?.message}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <button
            type="submit"
            className="cursor-pointer w-full bg-primary text-white py-3 px-6 rounded-lg hover:opacity-90"
          >
            Daxil olun
          </button>

          <div className="flex items-center justify-center gap-1.5">
            <span className="h-px w-full bg-[#866AB4]" />
            <span className="text-sm text-1 whitespace-nowrap">və ya</span>
            <span className="h-px w-full bg-[#866AB4]" />
          </div>

          <div className="flex justify-center flex-col">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
