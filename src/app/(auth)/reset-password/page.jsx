"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/lib/schemas/authSchemas";
import { resetPassword } from "@/lib/authService";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import X_Icon from "../../../../public/icons/x.svg";
import MessageModal from "@/components/ui/MessageModal";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const token = useMemo(() => searchParams?.get("token") || "", [searchParams]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    if (!token) {
      setModal({
        open: true,
        variant: "error",
        title: "Xəta",
        message: "Yeniləmə linki etibarsızdır. Emaildən gələn linkə daxil olun.",
      });
      return;
    }

    try {
      await resetPassword({ token, password: data.password });
      setModal({
        open: true,
        variant: "success",
        title: "Uğurlu",
        message: "Şifrə uğurla yeniləndi. İndi giriş edin.",
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Xəta baş verdi";
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
        primaryText={modal.variant === "success" ? "Girişə keç" : "Bağla"}
        onPrimary={() => {
          setModal((prev) => ({ ...prev, open: false }));
          if (modal.variant === "success") router.replace("/login");
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
                  <h1 className="text-[32px] font-medium text-center">Şifrə yenilə</h1>
                  <p className="text-[16px] text-center text-black/80">
                    Yeni şifrənizi təyin edin.
                  </p>
                </div>

                {!token && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Yeniləmə tokeni tapılmadı. Zəhmət olmasa emailinizdəki linki açın.
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="password" className="text-sm font-medium text-black">
                        Yeni şifrə<span className="text-red-500">*</span>
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
                              placeholder="Yeni şifrənizi daxil edin"
                              className="w-full border border-black p-2 rounded-md text-base placeholder:pl-2"
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <div className="h-6 text-sm text-red-500">{errors.password?.message}</div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                        Şifrəni təkrarla<span className="text-red-500">*</span>
                      </label>
                      <div className="relative w-full">
                        <Controller
                          name="confirmPassword"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              id="confirmPassword"
                              type={showConfirm ? "text" : "password"}
                              placeholder="Şifrəni təkrarlayın"
                              className="w-full border border-black p-2 rounded-md text-base placeholder:pl-2"
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <div className="h-6 text-sm text-red-500">{errors.confirmPassword?.message}</div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 cursor-pointer w-full bg-primary text-white py-3 px-6 rounded-lg hover:opacity-90"
                  >
                    Şifrəni yenilə
                  </button>

                  <div className="mt-4 text-center text-sm text-black/70">
                    <Link href="/login" className="text-primary font-medium">
                      Girişə qayıt
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <div className="py-5 max-[1025px]:hidden w-[50%] px-20 max-[1025px]:px-5 max-[431px]:px-4 flex items-center justify-center">
              <div className="max-w-[520px] text-white">
                <h2 className="text-[32px] font-semibold mb-3">Yeni şifrə təyin edin</h2>
                <p className="text-white/90">
                  Güclü şifrə seçin: ən azı 8 simvol, böyük/kiçik hərf, rəqəm və xüsusi simvol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
