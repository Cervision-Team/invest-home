import * as yup from "yup";

export const agentFormSchema = yup.object().shape({
  name: yup.string().trim().required("Ad tələb olunur"),
  surname: yup.string().trim().required("Soyad tələb olunur"),
  email: yup.string().email("Yanlış email").required("Email tələb olunur"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Telefon nömrəsi yalnız rəqəmlərdən ibarət olmalıdır")
    .min(7, "Telefon nömrəsi çox qısadır")
    .required("Telefon nömrəsi tələb olunur"),
  experiences: yup
    .array()
    .of(
      yup
        .object({
          position: yup.string().trim().required("Vəzifə tələb olunur"),
          company: yup.string().trim().required("Şirkət tələb olunur"),
          startMonth: yup.string().required("Başlama tarixi tələb olunur"),
          isCurrent: yup.boolean().default(false),
          endMonth: yup
            .string()
            .when("isCurrent", {
              is: true,
              then: (schema) => schema.nullable(),
              otherwise: (schema) => schema.required("Bitmə tarixi tələb olunur"),
            })
            .test(
              "endAfterStart",
              "Bitmə tarixi başlama tarixindən əvvəl ola bilməz",
              function (endMonth) {
                const { startMonth, isCurrent } = this.parent || {};
                if (isCurrent) return true;
                if (!startMonth || !endMonth) return true;
                // YYYY-MM compares correctly lexicographically
                return String(endMonth) >= String(startMonth);
              }
            ),
          description: yup.string().trim().max(500, "Maksimum 500 simvol"),
        })
        .required()
    )
    .default([])
    .notRequired(),
  educations: yup
    .array()
    .of(
      yup
        .object({
          institution: yup.string().trim().required("Təhsil müəssisəsi tələb olunur"),
          degree: yup.string().trim().required("İxtisas/Dərəcə tələb olunur"),
          startMonth: yup.string().required("Başlama tarixi tələb olunur"),
          endMonth: yup
            .string()
            .required("Bitmə tarixi tələb olunur")
            .test(
              "endAfterStart",
              "Bitmə tarixi başlama tarixindən əvvəl ola bilməz",
              function (endMonth) {
                const { startMonth } = this.parent || {};
                if (!startMonth || !endMonth) return true;
                return String(endMonth) >= String(startMonth);
              }
            ),
          description: yup.string().trim().max(500, "Maksimum 500 simvol"),
        })
        .required()
    )
    .default([])
    .notRequired(),
  age: yup
    .number()
    .typeError("Yaş bir rəqəm olmalıdır")
    .min(18, "Ən azı 18 olmalıdır")
    .required("Yaş tələb olunur"),
  residentialAddress: yup.string().required("Ünvan tələb olunur"),
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
