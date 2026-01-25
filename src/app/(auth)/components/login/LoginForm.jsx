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
}

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await loginWithEmail({ email: data.email, password: data.password });

      const token = res?.token;
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
      router.replace("/otp");
    } catch (err) {
      const errorResponse = err.response.data.message
      const errorMessage = ERROR_CODE[errorResponse]
      const errorIndex = Object.keys(ERROR_CODE).indexOf(errorResponse);

      switch (errorIndex) {
        case 0:
        case 1:
          setError("email", {
            type: "server",
            message: errorMessage
          });
          break
        case 2:
          setError("password", {
            type: "server",
            message: errorMessage
          });
          break;
        default:
          console.log("Unknown backend error:", errorResponse);
          break;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <div className="flex flex-col gap-[27px]">
        {/* Email input */}
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
              {/* <Image src={Mail.src} alt="mail" width={20} height={20} /> */}
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
        {/* Buttons */}
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

          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
