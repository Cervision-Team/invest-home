const AZ_COUNTRY_CODE = "+994";

export const splitPhoneNumber = (value) => {
  if (!value) return { phoneCountryCode: AZ_COUNTRY_CODE, phoneLocalNumber: "" };

  const raw = String(value).trim();
  const cleaned = raw.replace(/[\s\-()]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");

  let local = digitsOnly;
  if (digitsOnly.startsWith("994")) local = digitsOnly.slice(3);
  if (local.length === 10 && local.startsWith("0")) local = local.slice(1);

  return {
    phoneCountryCode: AZ_COUNTRY_CODE,
    phoneLocalNumber: local,
  };
};

export const buildPhoneNumber = ({ phoneCountryCode, phoneLocalNumber } = {}) => {
  const code = phoneCountryCode || AZ_COUNTRY_CODE;
  const localDigits = String(phoneLocalNumber || "").replace(/\D/g, "");
  if (!localDigits) return "";
  return `${code}${localDigits}`;
};

export const mapUserToFormDefaults = (user) => {
  const { phoneCountryCode, phoneLocalNumber } = splitPhoneNumber(user?.phoneNumber);
  return {
    ...user,
    phoneCountryCode,
    phoneLocalNumber,
  };
};
