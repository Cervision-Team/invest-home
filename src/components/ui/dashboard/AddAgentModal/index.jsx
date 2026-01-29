"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, X } from "lucide-react";
import {
  addAgentDefaultValues,
  addAgentSchema,
} from "@/lib/schemas/addAgentSchema";
import { getRoles } from "@/services/api/endpoints/roleService";

const labelCls = "text-[12px] text-black/70";
const inputCls =
  "w-full h-9 rounded-lg border border-black/15 bg-white px-3 text-[14px] text-[#0A0D14] placeholder:text-black/40 outline-none focus:border-(--primary-color)";
const errorCls = "mt-1 text-[12px] text-[#FF403D]";

const Field = ({ label, required, error, children }) => {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1">
        <span className={labelCls}>{label}</span>
        {required ? <span className="text-[#FF403D]">*</span> : null}
      </div>
      <div className="mt-1">{children}</div>
      {error ? <p className={errorCls}>{error}</p> : null}
    </div>
  );
};

const AddAgentModal = ({ isOpen, onClose, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);

  const defaultValues = useMemo(() => addAgentDefaultValues, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addAgentSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let alive = true;

    (async () => {
      try {
        const res = await getRoles();
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.roles)
            ? res.data.roles
            : [];

        if (!alive) return;
        setRoles(list.filter((r) => r && r.name));
      } catch (err) {
        if (!alive) return;
        setRoles([]);
        console.log("Error fetching roles:", err);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, reset, defaultValues]);

  if (!isOpen) return null;

  const submit = async (values) => {
    console.log("[AddAgentModal] submit values:", values);
    const res = await onSubmit?.(values);
    if (res !== false) onClose?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-9998 bg-black/40" onClick={onClose} />

      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div className="w-full max-w-[820px] rounded-[10px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/10">
            <h2 className="text-[18px] font-semibold text-[#0A0D14]">
              Agent əlavə et
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Bağla"
              className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-black/5"
            >
              <X size={18} className="text-black/70" />
            </button>
          </div>

          <form onSubmit={handleSubmit(submit)} className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <Field label="Ad/Soyad" required error={errors.fullName?.message}>
                <input
                  {...register("fullName")}
                  className={inputCls}
                  placeholder="---"
                />
              </Field>

              <Field label="Doğum tarixi" error={errors.birthDate?.message}>
                <input
                  {...register("birthDate")}
                  className={inputCls}
                  type="date"
                />
              </Field>

              <Field label="Telefon" required error={errors.phone?.message}>
                <div className="relative">
                  <input
                    {...register("phone")}
                    className={`${inputCls} pr-10`}
                    placeholder="+994501234567"
                    inputMode="tel"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/45">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.81.3 1.6.54 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.06a2 2 0 0 1 2.11-.45c.76.24 1.55.42 2.36.54A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>
              </Field>

              <Field label="Vəzifəsi" error={errors.role?.message}>
                <input
                  {...register("role")}
                  className={inputCls}
                  placeholder="----"
                />
              </Field>

              <Field label="Email" required error={errors.email?.message}>
                <input
                  {...register("email")}
                  className={inputCls}
                  placeholder="investhome@index.com"
                  inputMode="email"
                />
              </Field>

              <Field label="Yaşayış ünvanı" error={errors.address?.message}>
                <input
                  {...register("address")}
                  className={inputCls}
                  placeholder="Heydər Əliyev pr."
                />
              </Field>

              <Field label="Rol" required error={errors.roleName?.message}>
                <select {...register("roleName")} className={inputCls}>
                  <option value="">Rol seçin</option>
                  {roles
                    .slice()
                    .sort((a, b) => String(a?.name).localeCompare(String(b?.name)))
                    .map((r) => (
                      <option key={r?.id ?? r?.name} value={r?.name}>
                        {r?.name}
                      </option>
                    ))}
                </select>
              </Field>

              <Field label="Şifrə" required error={errors.password?.message}>
                <div className="relative">
                  <input
                    {...register("password")}
                    className={`${inputCls} pr-10`}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5"
                    aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                    title={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-black/55" />
                    ) : (
                      <Eye size={18} className="text-black/55" />
                    )}
                  </button>
                </div>
              </Field>

              <div className="md:col-span-2">
                <Field label="Əlavə qeyd" error={errors.note?.message}>
                  <textarea
                    {...register("note")}
                    className="w-full min-h-32 rounded-[10px] border border-black/15 bg-white px-3 py-3 text-[14px] text-[#0A0D14] placeholder:text-black/40 outline-none focus:border-(--primary-color)"
                    placeholder="Buraya yazın...."
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-4 rounded-lg bg-(--primary-color) text-white text-[14px] font-medium hover:opacity-90 disabled:opacity-50"
              >
                Yadda saxla
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAgentModal;
