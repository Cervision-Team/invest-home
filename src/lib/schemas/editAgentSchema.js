import * as yup from "yup";
import { emailSchema, optionalPasswordSchema } from "./authSchemas";

export const editAgentDefaultValues = {
  fullName: "",
  birthDate: "",
  phoneNumber: "+994",
  position: "",
  role: "",
  email: "",
  location: "",
  aboutMe: "",
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
    phoneNumber: yup
      .string()
      .trim()
      .required("Telefon vacibdir")
      .matches(/^\+994\d{9}$/, "Telefon formatı: +994501234567"),
    position: yup.string().trim().nullable().transform((v) => (v === "" ? null : v)),
    role: yup.string().trim().required("Rol seçin"),
    email: emailSchema,
    location: yup
      .string()
      .trim()
      .nullable()
      .transform((v) => (v === "" ? null : v)),
    aboutMe: yup.string().trim().nullable().transform((v) => (v === "" ? null : v)),
    password: optionalPasswordSchema,
  })
  .required();
