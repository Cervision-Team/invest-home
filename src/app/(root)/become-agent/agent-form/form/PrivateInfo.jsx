import Image from "next/image";
import { useState, useEffect } from "react";
import { agentFormSchema } from "@/lib/schemas/agentSchema";

const PrivateInfo = ({
  formData,
  updateForm,
  onValidationChange,
  showAllErrors,
  setShowAllErrors,
}) => {
  const [errors, setErrors] = useState({});

  const validateField = async (fieldName, value) => {
    try {
      await agentFormSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    } catch (err) {
      if (err.name === "ValidationError") {
        setErrors((prev) => ({ ...prev, [fieldName]: err.message }));
      }
    }
    checkFormValidity();
  };

  const checkFormValidity = async () => {
    try {
      const stepData = (({ fullName, email, phone, about1, about2 }) => ({
        fullName,
        email,
        phone,
        about1,
        about2,
      }))(formData);

      await agentFormSchema
        .pick(["fullName", "email", "phone", "about1", "about2"])
        .validate(stepData, { abortEarly: false });

      onValidationChange(true);
    } catch {
      onValidationChange(false);
    }
  };

  const validateAllFields = async () => {
    try {
      const stepData = (({ fullName, email, phone, about1, about2 }) => ({
        fullName,
        email,
        phone,
        about1,
        about2,
      }))(formData);

      await agentFormSchema
        .pick(["fullName", "email", "phone", "about1", "about2"])
        .validate(stepData, { abortEarly: false });

      setErrors({});
      onValidationChange(true);
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
        onValidationChange(false);
      }
    }
  };

  useEffect(() => {
    if (showAllErrors) {
      validateAllFields();
      setShowAllErrors(false);
    }
  }, [showAllErrors]);

  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  const inputClass = (field) =>
    `max-[430px]:placeholder-primary max-[430px]:text-[16px]
     max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary
     outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px]
     input-field ${errors[field] ? "error" : ""}`;

  return (
    <>
      <style>{`
        .input-field {
          padding: 12px 16px;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 0, 0, 0.12);
          border-radius: 12px;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          appearance: none;
          color: #1f2937;
        }


        .input-field:hover {
          border-color: #26B5A0;
        }

        .input-field:focus {
          outline: none;
          border-color: #1B8F7D;
          background-color: rgba(255, 255, 255, 0.98);
        }

        .input-field.error {
          border-color: #ef4444;
          background-color: rgba(254, 242, 242, 0.95);
          animation: shake 0.5s ease-in-out;
        }

        .input-field.error:hover {
          border-color: #dc2626;
        }

        .input-field.error:focus {
          border-color: #dc2626;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div className="flex gap-[95px] pb-[16px] min-[768px]:border-b-[1px] border-[rgba(0,0,0,0.2)]">
        <div className="min-[1200px]:basis-[50%] w-full">
          <form>
            <div className="flex flex-col gap-[16px]">
              {[
                { name: "fullName", label: "Ad Soyad", required: true, placeholder: "Ad Soyad" },
                { name: "email", label: "Email", required: true, placeholder: "investhomeaz@gmail.com", type: "email" },
                { name: "phone", label: "Telefon", required: true, placeholder: "phone" },
                { name: "about1", label: "Haqqınızda 1", required: true, placeholder: "İş Təcrübəniz" },
                { name: "about2", label: "Haqqınızda 2", required: false, placeholder: "İş Təcrübəniz" },
              ].map(({ name, label, required, placeholder, type = "text" }) => (
                <div key={name} className="flex flex-col gap-[8px]">
                  <label className="max-[430px]:hidden">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className={inputClass(name)}
                    value={formData[name] || ""}
                    onChange={(e) => {
                      updateForm(name, e.target.value);
                      validateField(name, e.target.value);
                    }}
                    onBlur={(e) => validateField(name, e.target.value)}
                  />
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
              ))}
            </div>
          </form>
        </div>

        <div className="max-[1200px]:hidden flex items-center basis-[50%]">
          <Image src="/gifs/building.gif" alt="building" width={519} height={389} />
        </div>
      </div>
    </>
  );
};

export default PrivateInfo;
