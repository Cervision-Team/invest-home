import * as yup from "yup";

export const agentFormSchema = yup.object().shape({
  fullName: yup.string().required("Ad və soyad tələb olunur"),
  email: yup.string().email("Yanlış email").required("Email tələb olunur"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Telefon nömrəsi yalnız rəqəmlərdən ibarət olmalıdır")
    .min(7, "Telefon nömrəsi çox qısadır")
    .required("Telefon nömrəsi tələb olunur"),
  about1: yup.string().required("Bu sahə tələb olunur"),
  about2: yup.string().nullable(),
  education: yup.string().required("Təhsil tələb olunur"),
  age: yup
    .number()
    .typeError("Yaş bir rəqəm olmalıdır")
    .min(18, "Ən azı 18 olmalıdır")
    .required("Yaş tələb olunur"),
  address: yup.string().required("Ünvan tələb olunur"),
  cv: yup
    .mixed()
    .required("CV tələb olunur")
    .test("fileSize", "Fayl çox böyükdür", (value) =>
      value ? value.size <= 2 * 1024 * 1024 : true
    )
    .test("fileType", "Dəstəklənməyən fayl növü", (value) =>
      value ? ["application/pdf"].includes(value.type) : true
    ),
});
