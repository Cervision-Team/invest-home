import * as yup from "yup";

export const agentFormSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Phone must be digits only")
    .min(7, "Phone number is too short")
    .required("Phone number is required"),
  about1: yup.string().required("This field is required"),
  about2: yup.string().nullable(),
  education: yup.string().required("Education is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .min(18, "Must be at least 18")
    .required("Age is required"),
  address: yup.string().required("Address is required"),
  cv: yup
    .mixed()
    .required("CV is required")
    .test("fileSize", "File too large", (value) =>
      value ? value.size <= 2 * 1024 * 1024 : true
    )
    .test("fileType", "Unsupported file type", (value) =>
      value ? ["application/pdf"].includes(value.type) : true
    ),
});
