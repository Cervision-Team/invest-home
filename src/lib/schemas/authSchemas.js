import * as yup from "yup";

export const passwordSchema = yup
  .string()
  .required("Şifrə vacibdir")
  .min(8, "Şifrə ən azı 8 simvol olmalıdır")
  .matches(/[A-Z]/, "Şifrədə ən azı bir böyük hərf olmalıdır")
  .matches(/[a-z]/, "Şifrədə ən azı bir kiçik hərf olmalıdır")
  .matches(/\d/, "Şifrədə ən azı bir rəqəm olmalıdır")
  .matches(/[^A-Za-z0-9]/, "Şifrədə ən azı bir xüsusi simvol olmalıdır");

export const emailSchema = yup
  .string()
  .required("Email vacibdir")
  .email("Düzgün email daxil edin");

export const loginPasswordSchema = yup.string().required("Şifrə vacibdir");

export const loginDefaultValues = {
  email: "",
  password: "",
};

export const loginSchema = yup
  .object({
    email: emailSchema,
    password: loginPasswordSchema,
  })
  .required();

export const resetPasswordSchema = yup
  .object({
    password: passwordSchema,
    confirmPassword: yup
      .string()
      .required("Şifrənin təkrarı vacibdir")
      .oneOf([yup.ref("password")], "Şifrələr uyğun deyil"),
  })
  .required();
