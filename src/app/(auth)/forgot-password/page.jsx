"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { getAuthErrorMessageFromAxios, requestPasswordReset } from "@/lib/authService";
import { Mail } from "lucide-react";
import X_Icon from "../../../../public/icons/x.svg";
import MessageModal from "@/components/ui/MessageModal";

const schema = yup
    .object({
        email: yup.string().required("Email vacibdir").email("Düzgün email daxil edin"),
    })
    .required();

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        variant: "success",
        title: "",
        message: "",
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            await requestPasswordReset({ email: data.email });
            setSubmitted(true);
            setModal({
                open: true,
                variant: "success",
                title: "Uğurlu",
                message: "Şifrə yeniləmə linki emailinizə göndərildi.",
            });
        } catch (err) {
            const message = getAuthErrorMessageFromAxios(err, "Xəta baş verdi");
            setModal({ open: true, variant: "error", title: "Xəta", message });
        }
    };

    return (
        <>
            <MessageModal
                isOpen={modal.open}
                variant={modal.variant}
                title={modal.title}
                message={modal.message}
                primaryText={modal.variant === "success" ? "Girişə qayıt" : "Bağla"}
                secondaryText={modal.variant === "success" ? "Yenidən cəhd et" : undefined}
                onPrimary={() => {
                    setModal((prev) => ({ ...prev, open: false }));
                    if (modal.variant === "success") router.replace("/login");
                }}
                onSecondary={() => {
                    setModal((prev) => ({ ...prev, open: false }));
                    setSubmitted(false);
                }}
                onClose={() => setModal((prev) => ({ ...prev, open: false }))}
            />

            <section className="relative h-screen">
                <div className="max-[1025px]:hidden flex min-h-full">
                    <div className="w-[50%]"></div>
                    <div className="bg-[#02836F] w-[50%]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto absolute top-0 left-[50%] translate-x-[-50%] min-h-full w-full flex min-[1024px]:items-center">
                    <div className="flex min-w-0 w-full">
                        <div className="max-[1025px]:w-full w-[50%] px-20 max-[1025px]:px-5 max-[431px]:px-4 flex justify-center">
                            <div className="py-5 max-[1025px]:w-[600px] w-[410px] flex flex-col gap-6">
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

                                <div className="flex flex-col gap-3">
                                    <h1 className="text-[32px] font-medium text-center">Şifrəmi unutdum</h1>
                                    <p className="text-[16px] text-center text-black/80">
                                        Emailinizi daxil edin — şifrənizi yeniləmək üçün sizə link göndərəcəyik.
                                    </p>
                                </div>

                                {submitted ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="rounded-lg border border-black/10 bg-black/5 p-4 text-sm text-black/80">
                                            Email göndərildi. Zəhmət olmasa, inbox və spam qovluğunu yoxlayın.
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Link href="/login" className="text-primary font-medium">
                                                Girişə qayıt
                                            </Link>
                                            <button
                                                type="button"
                                                className="text-sm text-black/70 hover:text-black"
                                                onClick={() => setSubmitted(false)}
                                            >
                                                Yenidən cəhd et
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
                                        <div className="flex flex-col gap-2">
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
                                            <div className="h-6 text-sm text-red-500">{errors.email?.message}</div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-2 cursor-pointer w-full bg-primary text-white py-3 px-6 rounded-lg hover:opacity-90"
                                        >
                                            Link göndər
                                        </button>

                                        <div className="mt-4 text-center text-sm text-black/70">
                                            <Link href="/login" className="text-primary font-medium">
                                                Girişə qayıt
                                            </Link>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        <div className="py-5 max-[1025px]:hidden w-[50%] px-20 max-[1025px]:px-5 max-[431px]:px-4 flex items-center justify-center text-center">
                            <div className="max-w-[520px] text-white">
                                <h2 className="text-[32px] font-semibold mb-3">Təhlükəsiz şifrə yeniləmə</h2>
                                <p className="text-white/90">
                                    Link yalnız qısa müddət etibarlı olur. Şifrənizi yenilədikdən sonra yenidən giriş edə bilərsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
