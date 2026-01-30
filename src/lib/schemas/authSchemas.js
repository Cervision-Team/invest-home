import * as yup from "yup";

export const passwordSchema = yup
  .string()
  .required("Şifrə vacibdir")
  .min(8, "Şifrə ən azı 8 simvol olmalıdır")
  .matches(/[A-Z]/, "Şifrədə ən azı bir böyük hərf olmalıdır")
  .matches(/[a-z]/, "Şifrədə ən azı bir kiçik hərf olmalıdır")
  .matches(/\d/, "Şifrədə ən azı bir rəqəm olmalıdır")
  .matches(/[^A-Za-z0-9]/, "Şifrədə ən azı bir xüsusi simvol olmalıdır");

export const optionalPasswordSchema = yup
  .string()
  .nullable()
  .transform((v) => (v === "" ? null : v))
  .test("password-rules", function (value) {
    if (!value) return true;
    
    if (value.length < 8) {
      return this.createError({ message: "Şifrə ən azı 8 simvol olmalıdır" });
    }
    if (!/[A-Z]/.test(value)) {
      return this.createError({ message: "Şifrədə ən azı bir böyük hərf olmalıdır" });
    }
    if (!/[a-z]/.test(value)) {
      return this.createError({ message: "Şifrədə ən azı bir kiçik hərf olmalıdır" });
    }
    if (!/\d/.test(value)) {
      return this.createError({ message: "Şifrədə ən azı bir rəqəm olmalıdır" });
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return this.createError({ message: "Şifrədə ən azı bir xüsusi simvol olmalıdır" });
    }
    return true;
  });

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
