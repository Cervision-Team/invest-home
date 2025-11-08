"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { loginWithPhone } from "@/lib/authService";
import { toast } from "react-toastify";
import Image from "next/image";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import Phone from "../../../../../public/icons/phone-auth.svg";

const globalPhoneRegex = /^\+?[1-9]\d{7,14}$/;
const schema = yup.object({
  phone: yup
    .string()
    .required("Telefon nömrəsi vacibdir")
    .matches(globalPhoneRegex, "Telefon nömrəsi düzgün formatda deyil"),
  password: yup
    .string()
    .required("Şifrə vacibdir")
    .min(6, "Şifrə ən azı 6 simvol olmalıdır")
    .matches(/[A-Z]/, "Şifrədə ən azı bir böyük hərf olmalıdır")
    .matches(/[a-z]/, "Şifrədə ən azı bir kiçik hərf olmalıdır")
    .matches(/\d/, "Şifrədə ən azı bir rəqəm olmalıdır"),
});

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await loginWithPhone({ "phoneNumber": data.phone, "password": data.password });
      localStorage.setItem("access-token", res)
      // localStorage.setItem("phoneNumber", data.phone);
      // localStorage.setItem("entranceType", "LOGIN");
      router.replace("/");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(error.response.data.message || "İstifadəçi tapılmadı");
      } else {
        toast.error(error.response?.data?.message || "Xəta baş verdi");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <div className="flex flex-col gap-[27px]">
        {/* Phone input */}
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="phone" className="text-sm font-medium text-black">
            Telefon<span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <Controller
              name="phone"
              control={control}
              defaultValue="+994"
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  id="phone"
                  placeholder="994*********"
                  className="h-[44px] px-4 border border-black w-full text-base rounded-lg"
                />
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Image src={Phone.src} alt="phone" width={20} height={20} />
            </span>
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-[4px]">
          <label htmlFor="password" className="text-sm font-medium text-black">
            Şifrə<span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Şifrənizi daxil edin"
            {...register("password")}
            className="border border-black p-2 rounded-md text-base placeholder:pl-2"
          />
          <div className="h-[28px] text-sm text-red-500">
            {errors.password?.message}
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col gap-[24px]">
          <button
            type="submit"
            className="cursor-pointer w-full bg-primary text-white py-3 px-6 rounded-lg hover:opacity-90"
          >
            Daxil ol
          </button>

          <div className="flex items-center justify-center gap-[6px]">
            <span className="h-px w-full bg-[#866AB4]" />
            <span className="text-sm text-1 whitespace-nowrap">və ya</span>
            <span className="h-px w-full bg-[#866AB4]" />
          </div>

          {/* ✅ Google Login Button here */}
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
