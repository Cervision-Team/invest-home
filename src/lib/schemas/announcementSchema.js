import * as Yup from "yup";

// Step 0 - NewAnnc Validation Schema (formerly Step 1)
const NewAnncValidationSchema = Yup.object().shape({
  announcementType: Yup.string()
    .required("Elan növü seçilməlidir")
    .oneOf(["sell", "buy", "rentOut", "rentIn"], "Düzgün elan növü seçin"),
});

// Step 1 - ForSale & ForRent (dynamic) (formerly Step 2)
const getForSaleOrRentValidationSchema = (
  propertyType,
  officeType,
  isMortgaged,
  announcementType
) => {
  const schema = {
    propertyType: Yup.string()
      .required("Əmlak növü seçilməlidir")
      .oneOf(
        ["apartment", "object", "land", "house", "office", "garage"],
        "Düzgün əmlak növü seçin"
      ),
  };

  if (propertyType === "office") {
    schema.officeType = Yup.string()
      .required("Ofis tipi seçilməlidir")
      .oneOf(
        ["businessCenter", "apartmentOffice", "gardenHouse"],
        "Düzgün ofis tipi seçin"
      );
  }

  if (
    propertyType === "apartment" ||
    propertyType === "object" ||
    (propertyType === "office" && officeType !== "gardenHouse")
  ) {
    schema.buildingType = Yup.string()
      .required("Bina tipi seçilməlidir")
      .oneOf(["newBuilding", "oldBuilding"], "Düzgün bina tipi seçin");
  }

  if (propertyType && propertyType !== "land") {
    schema.repairStatus = Yup.string()
      .required("Təmir vəziyyəti seçilməlidir")
      .oneOf(["renewed", "notRenewed"], "Düzgün təmir vəziyyəti seçin");

    schema.area = Yup.number()
      .typeError("Sahə rəqəm olmalıdır")
      .positive("Sahə müsbət olmalıdır")
      .required("Sahə daxil edilməlidir");
  }

  if (
    propertyType === "house" ||
    propertyType === "land" ||
    (propertyType === "office" && officeType === "gardenHouse")
  ) {
    schema.landArea = Yup.number()
      .typeError("Torpağın sahəsi rəqəm olmalıdır")
      .positive("Torpağın sahəsi müsbət olmalıdır")
      .required("Torpağın sahəsi daxil edilməlidir");
  }

  if (
    propertyType === "apartment" ||
    propertyType === "object" ||
    (propertyType === "office" && officeType !== "gardenHouse")
  ) {
    schema.floor = Yup.number()
      .typeError("Mərtəbə rəqəm olmalıdır")
      .integer("Mərtəbə tam ədəd olmalıdır")
      .positive("Mərtəbə müsbət olmalıdır")
      .required("Mərtəbə daxil edilməlidir");
  }

  if (
    propertyType === "apartment" ||
    propertyType === "house" ||
    propertyType === "office" ||
    propertyType === "object"
  ) {
    schema.totalFloors = Yup.number()
      .typeError("Ümumi mərtəbələr rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət ədəd olmalıdır")
      .required("Ümumi mərtəbələr daxil edilməlidir");
  }

  if (
    propertyType === "apartment" ||
    propertyType === "house" ||
    propertyType === "object" ||
    (propertyType === "office" && officeType !== "businessCenter")
  ) {
    schema.rooms = Yup.number()
      .typeError("Otaq sayı rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət ədəd olmalıdır")
      .required("Otaq sayı daxil edilməlidir");

    schema.bathrooms = Yup.number()
      .typeError("Sanitar qovşağı sayı rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət ədəd olmalıdır")
      .required("Sanitar qovşağı daxil edilməlidir");
  }

  if (propertyType) {
    schema.price = Yup.number()
      .typeError("Qiymət rəqəm olmalıdır")
      .positive("Qiymət müsbət olmalıdır")
      .required("Qiymət daxil edilməlidir");
  }

  schema.isMortgaged = Yup.boolean().required("İpoteka statusu seçilməlidir");

  if (isMortgaged) {
    schema.initialPayment = Yup.number()
      .typeError("İlkin ödəniş rəqəm olmalıdır")
      .min(0, "İlkin ödəniş mənfi ola bilməz")
      .required("İlkin ödəniş daxil edilməlidir");

    schema.monthlyPayment = Yup.number()
      .typeError("Aylıq ödəniş rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Aylıq ödəniş daxil edilməlidir");

    schema.remainingMonths = Yup.number()
      .typeError("Qalıq ay rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .min(0, "0 və ya daha böyük olmalıdır")
      .max(11, "Qalıq ay 11-dən çox ola bilməz")
      .required("Qalıq ay daxil edilməlidir");
  }

  return Yup.object().shape(schema);
};

// Step 1 - Daily (formerly Step 2)
const getDailyValidationSchema = (propertyType) => {
  const schema = {
    propertyType: Yup.string()
      .required("Əmlak növü seçilməlidir")
      .oneOf(
        ["apartmentDaily", "gardenHouse", "aframe", "kotej", "room"],
        "Düzgün əmlak növü seçin"
      ),
    guestCount: Yup.number()
      .typeError("Qonaq sayı rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Qonaq sayı daxil edilməlidir"),
    nightCount: Yup.number()
      .typeError("Gecə sayı rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Gecə sayı daxil edilməlidir"),
    checkInTime: Yup.string().required("Giriş vaxtı daxil edilməlidir"),
    checkOutTime: Yup.string().required("Çıxış vaxtı daxil edilməlidir"),
    dailyRate: Yup.number()
      .typeError("Günlük qiymət rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Günlük qiymət daxil edilməlidir"),
    area: Yup.number()
      .typeError("Sahə rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Sahə daxil edilməlidir"),
    bathrooms: Yup.number()
      .typeError("Sanitar qovşağı sayı rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Sanitar qovşağı daxil edilməlidir"),
  };

  if (propertyType === "apartmentDaily") {
    schema.buildingType = Yup.string()
      .required("Bina tipi seçilməlidir")
      .oneOf(["newBuilding", "oldBuilding"], "Düzgün bina tipi seçin");
    schema.floor = Yup.number()
      .typeError("Mərtəbə rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Mərtəbə daxil edilməlidir");
  } else {
    schema.landArea = Yup.number()
      .typeError("Torpağın sahəsi rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Torpağın sahəsi daxil edilməlidir");
    schema.rooms = Yup.number()
      .typeError("Otaq sayı rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Otaq sayı daxil edilməlidir");
  }

  if (propertyType === "apartmentDaily" || propertyType === "aframe") {
    schema.totalFloors = Yup.number()
      .typeError("Ümumi mərtəbələr rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Ümumi mərtəbələr daxil edilməlidir");
  }

  return Yup.object().shape(schema);
};

// Step 1 - Roommate (formerly Step 2)
const getRoommateValidationSchema = () =>
  Yup.object().shape({
    propertyType: Yup.string()
      .required("Əmlak növü seçilməlidir")
      .oneOf(
        ["apartmentRoommate", "houseRoommate"],
        "Düzgün əmlak növü seçin"
      ),
    price: Yup.number()
      .typeError("Qiymət rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Qiymət daxil edilməlidir"),
    area: Yup.number()
      .typeError("Sahə rəqəm olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Sahə daxil edilməlidir"),
    floor: Yup.number()
      .typeError("Mərtəbə rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Mərtəbə daxil edilməlidir"),
    totalFloors: Yup.number()
      .typeError("Ümumi mərtəbələr rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Ümumi mərtəbələr daxil edilməlidir"),
    rooms: Yup.number()
      .typeError("Otaq sayı rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Otaq sayı daxil edilməlidir"),
    bathrooms: Yup.number()
      .typeError("Sanitar qovşağı sayı rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .positive("Müsbət olmalıdır")
      .required("Sanitar qovşağı daxil edilməlidir"),

    buildingType: Yup.string()
      .required("Bina tipi seçilməlidir")
      .oneOf(["newBuilding", "oldBuilding"], "Düzgün bina tipi seçin"),

    repairStatus : Yup.string()
      .required("Təmir vəziyyəti seçilməlidir")
      .oneOf(["renewed", "notRenewed"], "Düzgün təmir vəziyyəti seçin")
  });

// Step 2 - AnncDetails (formerly Step 3)
export const anncDetailsSchema = Yup.object().shape({
  exit: Yup.string().required("Çıxarış seçilməlidir"),
  mortgage: Yup.string().required("İpoteka uyğunluğu seçilməlidir"),
  features: Yup.array().of(Yup.string()),
  description: Yup.string()
    .max(5000, "Təsvir 5000 simvoldan çox olmamalıdır")
    .min(50, "Təsvir ən azı 50 simvol olmalıdır")
    .required("Təsvir vacibdir"),
});

export const anncDetailsRentOutSchema = Yup.object().shape({
  features: Yup.array().of(Yup.string()),
  description: Yup.string()
    .max(5000, "Təsvir 5000 simvoldan çox olmamalıdır")
    .min(50, "Təsvir ən azı 50 simvol olmalıdır")
    .required("Təsvir vacibdir"),
});

// Step 2 - DailyAnncDetails (formerly Step 3)

export const dailyAnncDetailsSchema = Yup.object().shape({
  features: Yup.array().of(Yup.string()),
  description: Yup.string()
    .max(5000, "Təsvir 5000 simvoldan çox olmamalıdır")
    .min(50, "Təsvir ən azı 50 simvol olmalıdır")
    .required("Təsvir vacibdir"),
});

// Step 2 - RoommateAnncDetails (formerly Step 3)
export const roommateAnncDetailsSchema = Yup.object().shape({
  utilities: Yup.string().required("Kommunal seçilməlidir"),
  roomType: Yup.string().required("Otaq tipi seçilməlidir"),
  bedType: Yup.string().required("Yataq otağının tipi seçilməlidir"),
  ownerLives: Yup.string().required("Ev sahibi seçilməlidir"),
  residentsCount: Yup.number()
    .typeError("Rəqəm daxil edin")
    .positive("Müsbət rəqəm olmalıdır")
    .integer("Tam ədəd olmalıdır")
    .required("Evdə yaşayanların sayı vacibdir"),
  houseComposition: Yup.string().required("Evin tərkibi seçilməlidir"),
  features: Yup.array().of(Yup.string()),
  gender: Yup.string().required("Cinsi seçilməlidir"),
  workStatus: Yup.string().required("İş statusu seçilməlidir"),
  smoking: Yup.string().required("Siqaret seçilməlidir"),
  pets: Yup.string().required("Ev heyvanı seçilməlidir"),
  visitors: Yup.string().required("Əks cinsin gəlməsi seçilməlidir"),
  description: Yup.string()
    .max(5000, "Təsvir 5000 simvoldan çox olmamalıdır")
    .min(50, "Təsvir ən azı 50 simvol olmalıdır")
    .required("Təsvir vacibdir"),
});

// Step 3 - Location (formerly Step 4)
export const locationValidationSchema = Yup.object({
  selectedCity: Yup.string()
    .required('Şəhər seçilməlidir'),

  selectedDistrict: Yup.string()
    .required('Rayon seçilməlidir'),

  selectedSettlement: Yup.string()
    .required('Qəsəbə seçilməlidir'),

  selectedAddress: Yup.string()
    .required('Ünvan daxil edilməlidir')
    .max(200, 'Ünvan 200 simvoldan çox ola bilməz'),

  searchQuery: Yup.string()
    .max(100, 'Axtarış sorğusu 100 simvoldan çox ola bilməz'),

  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable()
});

// Step 4 - Media (formerly Step 5)
const getMediaValidationSchema = () =>
  Yup.object().shape({
    selectedMedia: Yup.array()
      .of(Yup.string().oneOf(["picture", "video"]))
      .min(1, "Media tipi seçilməlidir"),
    images: Yup.array()
      .of(Yup.mixed())
      .test("pictureCount", "Ən çox 20 şəkil yükləyə bilərsiniz", function (images) {
        const selectedMedia = this.parent.selectedMedia || [];
        if (!images || !selectedMedia.includes("picture")) return true;
        return images.length <= 50;
      }),
    videos: Yup.array()
      .of(Yup.mixed())
      .test("videoCount", "Yalnız 1 video yükləyə bilərsiniz", function (videos) {
        const selectedMedia = this.parent.selectedMedia || [];
        if (!videos || !selectedMedia.includes("video")) return true;
        return videos.length <= 1;
      }),
    uploadedFiles: Yup.array()
      .of(Yup.mixed())
      .min(1, "Ən azı 1 fayl yüklənməlidir"),
  });

export const validationSchemas = [
  NewAnncValidationSchema,
  Yup.object().shape({}), // Step 1 - dynamic (formerly Step 2)
  Yup.object().shape({}), // Step 2 - dynamic (formerly Step 3)
  locationValidationSchema,
  getMediaValidationSchema(),
];

const getFormType = (formValues) => {
  if (formValues.announcementType === "rentIn") return "rentIn";
  if (formValues.announcementType === "buy") return "buy";
  return "default";
};

export const getValidationSchema = (step, formType, formValues = {}) => {
  switch (step) {
    case 0: // This is now the first step
      return NewAnncValidationSchema;
    case 1: // This is now the second step
      if (
        formValues.announcementType === "sell" ||
        formValues.announcementType === "rentOut"
      ) {
        return getForSaleOrRentValidationSchema(
          formValues.propertyType,
          formValues.officeType,
          formValues.isMortgaged,
          formValues.announcementType
        );
      }
      if (formValues.announcementType === "buy") {
        return getDailyValidationSchema(formValues.propertyType);
      }
      if (formValues.announcementType === "rentIn") {
        return getRoommateValidationSchema(formValues.propertyType);
      }
      return Yup.object().shape({}); // Default for step 1 if no announcementType
    case 2: // This is now the third step
      if (formType === "rentIn") return roommateAnncDetailsSchema;
      if (formType === "buy") return dailyAnncDetailsSchema;
      if (formValues.announcementType === "rentOut") return anncDetailsRentOutSchema;
      return anncDetailsSchema;
    case 3: // This is now the fourth step
      return locationValidationSchema;
    case 4: // This is now the fifth step
      return getMediaValidationSchema();
    default:
      return Yup.object().shape({});
  }
};

export const validateStep = async (step, formValues) => {
  try {
    const formType = getFormType(formValues);
    const schema = getValidationSchema(step, formType, formValues);

    // 💡 Extract only fields present in this schema
    const schemaFields = Object.keys(schema.fields);
    const filteredValues = Object.fromEntries(
      Object.entries(formValues).filter(([key]) => schemaFields.includes(key))
    );

    await schema.validate(filteredValues, { abortEarly: false });
    return { isValid: true, errors: {} };

    
  } catch (error) {
    const errors = {};
    if (error.inner) {
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
    } else {
      errors.general = error.message;
    }
    return { isValid: false, errors };
  }
};
export const validateLocationStep = async (formValues) => {
  try {
    await locationValidationSchema.validate(formValues, { abortEarly: false });
    return {
      isValid: true,
      errors: {}
    };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      return {
        isValid: false,
        errors
      };
    }
    throw error;
  }
};