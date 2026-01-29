import * as yup from "yup";
import { emailSchema, passwordSchema } from "./authSchemas";

export const editAgentDefaultValues = {
  fullName: "",
  birthDate: "",
  phone: "+994",
  role: "",
  roleName: "",
  email: "",
  address: "",
  note: "",
  password: "",
};

export const editAgentSchema = yup
  .object({
    fullName: yup.string().trim().required("Ad/Soyad vacibdir"),
    birthDate: yup
      .string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .test("valid-date", "Doğum tarixi düzgün deyil", (v) => {
        if (!v) return true;
        const d = new Date(v);
        return !Number.isNaN(d.getTime());
      }),
    phone: yup
      .string()
      .trim()
      .required("Telefon vacibdir")
      .matches(/^\+994\d{9}$/, "Telefon formatı: +994501234567"),
    role: yup.string().trim().nullable().transform((v) => (v === "" ? null : v)),
    roleName: yup.string().trim().required("Rol seçin"),
    email: emailSchema,
    address: yup
      .string()
      .trim()
      .nullable()
      .transform((v) => (v === "" ? null : v)),
    note: yup.string().trim().nullable().transform((v) => (v === "" ? null : v)),
    password: passwordSchema,
  })
  .required();
