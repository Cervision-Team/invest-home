import * as Yup from "yup";

// Step 0 - NewAnnc Validation Schema
export const newAnncValidationSchema = Yup.object().shape({
  newAnnouncement: Yup.string()
    .required("Elan vermə səbəbi seçilməlidir")
    .oneOf(["sell", "buy", "rentOut", "rentIn"], "Düzgün elan səbəbi seçin"),
});

// Step 1 - TypeOfAnnc Validation Schema
const typeOfAnncValidationSchema = Yup.object().shape({
  announcementType: Yup.string()
    .required("Elan növü seçilməlidir")
    .oneOf(["sell", "rent", "daily", "roommate"], "Düzgün elan növü seçin"),
});

// Step 2 - ForSale & ForRent (dynamic)
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

  if (
    propertyType === "house" ||
    propertyType === "object" ||
    (propertyType === "office" && officeType === "apartmentOffice") ||
    propertyType === "garage" ||
    propertyType === "land"
  ) {
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

    schema.remainingYears = Yup.number()
      .typeError("Qalıq il rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .min(0, "0 və ya daha böyük olmalıdır")
      .max(50, "Qalıq il 50-dən çox ola bilməz")
      .required("Qalıq il daxil edilməlidir");

    schema.remainingMonths = Yup.number()
      .typeError("Qalıq ay rəqəm olmalıdır")
      .integer("Tam ədəd olmalıdır")
      .min(0, "0 və ya daha böyük olmalıdır")
      .max(11, "Qalıq ay 11-dən çox ola bilməz")
      .required("Qalıq ay daxil edilməlidir");
  }

  return Yup.object().shape(schema);
};

// Step 2 - Daily
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

// Step 2 - Roommate
const getRoommateValidationSchema = () =>
  Yup.object().shape({
    propertyType: Yup.string()
      .required("Əmlak növü seçilməlidir")
      .oneOf(
        ["apartmentRoommate", "apartmentRoommate"],
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

// Step 3 - AnncDetails
export const anncDetailsSchema = Yup.object().shape({
  exit: Yup.string().required("Çıxarış seçilməlidir"),
  mortgage: Yup.string().required("İpoteka uyğunluğu seçilməlidir"),
  features: Yup.array().of(Yup.string()),
  description: Yup.string()
    .max(5000, "Təsvir 5000 simvoldan çox olmamalıdır")
    .min(50, "Təsvir ən azı 50 simvol olmalıdır")
    .required("Təsvir vacibdir"),
});

// Step 3 - RoommateAnncDetails
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

// Step 4 - Location
export const locationValidationSchema = Yup.object({
  selectedCity: Yup.string()
    .required('Şəhər seçilməlidir')
    .oneOf([
      'baku-center', 'baku-sabail', 'baku-nasimi', 
      'baku-yasamal', 'baku-nizami', 'ganja', 
      'sumgayit', 'mingachevir', 'other'
    ], 'Etibarlı şəhər seçin'),

  selectedDistrict: Yup.string()
    .required('Rayon seçilməlidir')
    .oneOf([
      'baku-center', 'baku-sabail', 'baku-nasimi', 
      'baku-yasamal', 'baku-nizami', 'ganja', 
      'sumgayit', 'mingachevir', 'other'
    ], 'Etibarlı rayon seçin'),

  selectedSettlement: Yup.string()
    .required('Qəsəbə seçilməlidir')
    .oneOf([
      'baku-center', 'baku-sabail', 'baku-nasimi', 
      'baku-yasamal', 'baku-nizami', 'ganja', 
      'sumgayit', 'mingachevir', 'other'
    ], 'Etibarlı qəsəbə seçin'),

  selectedAddress: Yup.string()
    .required('Ünvan daxil edilməlidir')
    .min(10, 'Ünvan ən azı 10 simvol olmalıdır')
    .max(200, 'Ünvan 200 simvoldan çox ola bilməz')
    .matches(/^[a-zA-ZəĞğIıÖöŞşÇçÜü0-9\s,.-]+$/, 'Ünvanda etibarsız simvollar var'),

  searchQuery: Yup.string()
    .max(100, 'Axtarış sorğusu 100 simvoldan çox ola bilməz'),

  latitude: Yup.number()
    .when('selectedAddress', {
      is: (value) => value && value.length > 0,
      then: (schema) => schema
        .min(38.3929, 'Koordinat Azərbaycan ərazisində olmalıdır')
        .max(41.9555, 'Koordinat Azərbaycan ərazisində olmalıdır'),
      otherwise: (schema) => schema.nullable()
    }),

  longitude: Yup.number()
    .when('selectedAddress', {
      is: (value) => value && value.length > 0,
      then: (schema) => schema
        .min(44.7939, 'Koordinat Azərbaycan ərazisində olmalıdır')
        .max(50.3928, 'Koordinat Azərbaycan ərazisində olmalıdır'),
      otherwise: (schema) => schema.nullable()
    })
});

// Step 5 - Media
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
        return images.length <= 20;
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
  newAnncValidationSchema,
  typeOfAnncValidationSchema,
  Yup.object().shape({}), // Step 2 - dynamic
  Yup.object().shape({}), // Step 3 - dynamic
  locationValidationSchema,
  getMediaValidationSchema(),
];

const getFormType = (formValues) =>
  formValues.announcementType === "roommate" ? "roommate" : "default";

export const getValidationSchema = (step, formType, formValues = {}) => {
  switch (step) {
    case 0:
      return newAnncValidationSchema;
    case 1:
      return typeOfAnncValidationSchema;
    case 2:
      if (
        formValues.announcementType === "sell" ||
        formValues.announcementType === "rent"
      ) {
        return getForSaleOrRentValidationSchema(
          formValues.propertyType,
          formValues.officeType,
          formValues.isMortgaged,
          formValues.announcementType
        );
      }
      if (formValues.announcementType === "daily") {
        return getDailyValidationSchema(formValues.propertyType);
      }
      if (formValues.announcementType === "roommate") {
        return getRoommateValidationSchema(formValues.propertyType);
      }
      return Yup.object().shape({});
    case 3:
      return formType === "roommate"
        ? roommateAnncDetailsSchema
        : anncDetailsSchema;
    case 4:
      return locationValidationSchema;
    case 5:
      return getMediaValidationSchema();
    default:
      return Yup.object().shape({});
  }
};

export const validateStep = async (step, formValues) => {
  try {
    const formType = getFormType(formValues);
    const schema = getValidationSchema(step, formType, formValues);
    await schema.validate(formValues, { abortEarly: false });
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