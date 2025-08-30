"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authService";
import { toast } from "react-toastify";
import Image from "next/image";
import Phone from "../../../../../public/icons/phone-auth.svg"
import Google from "../../../../../public/icons/google.svg"
import EntryGate from "../EntryGate";

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
    terms: yup.boolean().oneOf([true], "Zəhmət olmasa şərtləri qəbul edin"),
});

const RegisterForm = () => {
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            await registerUser({ fullName: data.fullName, phone: data.phone });
            localStorage.setItem("phone", data.phone);
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
                            <Image
                                src={Phone.src}
                                alt="phone"
                                width={20}
                                height={20}
                            />
                        </span>
                    </div>
                    <div className="h-[28px] text-sm text-red-500">
                        {errors.phone?.message}
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
                            <span className="text-primary hover:text-green-800">
                                Şərtlər və qaydaları
                            </span>{" "}
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

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 border border-primary text-[#1B1F27] py-3 rounded-lg hover:bg-green-50 cursor-pointer"
                    >
                        <Image
                            src={Google.src}
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        <span className="font-medium">Sign up with Google</span>
                    </button>
                </div>
            </form>
        </>
    )
}

export default RegisterForm