"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authService";
import { toast } from "react-toastify";
import Image from "next/image";
import Phone from "../../../../../public/icons/phone-auth.svg";
import Google from "../../../../../public/icons/google.svg";
import EntryGate from "../EntryGate";
import Link from "next/link";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const globalPhoneRegex = /^\+?[1-9]\d{7,14}$/;

const schema = yup.object({
  fullName: yup
    .string()
    .required("Ad soyad vacibdir")
    .test(
      "two-words",
      "Zəhmət olmasa həm ad, həm soyad daxil edin",
      (v) => v && v.trim().split(" ").length >= 2
    ),
  phone: yup
    .string()
    .required("Telefon nömrəsi vacibdir")
    .matches(globalPhoneRegex, "Telefon nömrəsi düzgün formatda deyil"),
  password: yup
    .string()
    .required("Şifrə vacibdir")
    .min(8, "Şifrə ən azı 8 simvol olmalıdır")
    .matches(/[A-Z]/, "Şifrədə ən azı bir böyük hərf olmalıdır")
    .matches(/[a-z]/, "Şifrədə ən azı bir kiçik hərf olmalıdır")
    .matches(/\d/, "Şifrədə ən azı bir rəqəm olmalıdır")
    .matches(/[^A-Za-z0-9]/, "Şifrədə ən azı bir xüsusi simvol olmalıdır"),
  terms: yup.boolean().oneOf([true], "Zəhmət olmasa şərtləri qəbul edin"),
});

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: { prefix: "+994" }, });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const fullPhone = `${data.prefix}${data.phone}`;

      const res = await registerUser({
        fullName: data.fullName,
        phoneNumber: fullPhone,
        password: data.password,
      });
      localStorage.setItem("otp", res);
      localStorage.setItem("phoneNumber", fullPhone);
      localStorage.setItem("entranceType", "SIGNUP");
      router.replace("/otp");
    } catch (error) {
      if (error.response?.status === 302) {
        toast.info(error.response.data.message || "OTP artıq göndərilib");
      } else {
        toast.error(error.response?.data?.message || "Xəta baş verdi");
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
          <label htmlFor="phone" className="text-sm font-medium text-black">
            Telefon<span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <div className="flex gap-2">
              <Controller
                name="prefix"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="border border-black rounded-lg h-[44px] px-2"

                  >
                    <option value="+994">+994</option>

                  </select>
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    id="phone"
                    placeholder="50*********"
                    className="h-[44px] px-4 border border-black w-full text-base rounded-lg"
                  />
                )}
              />
            </div>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Image src={Phone.src} alt="phone" width={20} height={20} />
            </span>
          </div>
          <div className="h-[28px] text-sm text-red-500">
            {errors.phone?.message}
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
