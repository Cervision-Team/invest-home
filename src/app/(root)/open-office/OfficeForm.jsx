'use client'

import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const OfficeForm = () => {
  const [isCountryOpen, setIsCountryOpen] = React.useState(false)
  const countryDropdownRef = React.useRef(null)

  const validationSchema = Yup.object({
    nameSurname: Yup.string()
      .required('Ad Soyad daxil edilməlidir')
      .min(3, 'Ad Soyad ən azı 3 simvoldan ibarət olmalıdır'),
    email: Yup.string()
      .email('Düzgün email daxil edin')
      .required('Email daxil edilməlidir'),
    birthDate: Yup.date()
      .required('Doğum tarixi daxil edilməlidir')
      .max(new Date(), 'Doğum tarixi bugünkü tarixdən sonra ola bilməz')
      .test('age', '18 yaşdan kiçik olmamalısınız', function(value) {
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 18);
        return value <= cutoff;
      }),
    phone: Yup.string()
      .required('Telefon nömrəsi daxil edilməlidir')
      .matches(/^[0-9+\-\s()]+$/, 'Düzgün telefon nömrəsi daxil edin'),
    country: Yup.string()
      .required('Ölkə seçilməlidir'),
    officeLocation: Yup.string()
      .required('Ofis açmaq istədiyiniz yer daxil edilməlidir')
      .min(3, 'Ən azı 3 simvol daxil edin'),
    realEstateExperience: Yup.string()
      .required('Daşınmaz əmlak təcrübəniz haqqında məlumat daxil edilməlidir')
      .min(10, 'Ən azı 10 simvol daxil edin'),
    currentField: Yup.string()
      .required('Cari fəaliyyət sahəniz daxil edilməlidir')
      .min(5, 'Ən azı 5 simvol daxil edin'),
    additionalNote: Yup.string()
      .min(10, 'Ən azı 10 simvol daxil edin'),
  })

  const formik = useFormik({
    initialValues: {
      nameSurname: '',
      email: '',
      birthDate: '',
      phone: '',
      country: '',
      officeLocation: '',
      realEstateExperience: '',
      currentField: '',
      additionalNote: '',
    },
    validationSchema,
onSubmit: async (values, helpers) => {
  console.log('Form submitted:', values)

  await new Promise((resolve) => setTimeout(resolve, 2000)) // simulate API

  alert('Form uğurla göndərildi!')
  helpers.resetForm()
},
  })

  const inputClass = (field) =>
    `input-field w-full ${
       formik.touched[field] && formik.errors[field] ? 'error' : ''
     }`

  const countries = [
    { id: 'azerbaijan', name: 'Azərbaycan' },
    { id: 'turkey', name: 'Türkiyə' },
    { id: 'russia', name: 'Rusiya' },
    { id: 'georgia', name: 'Gürcüstan' },
    { id: 'iran', name: 'İran' },
    { id: 'other', name: 'Digər' }
  ]

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCountry = countries.find(c => c.id === formik.values.country)

console.log("isSubmitting:", formik.isSubmitting);
  return (
    <>
      <style jsx>{`
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

        .custom-select-button {
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
          cursor: pointer;
        }

        .custom-select-button:hover {
          border-color: #26B5A0;
        }

        .custom-select-button.error {
          border-color: #ef4444;
          background-color: rgba(254, 242, 242, 0.95);
          animation: shake 0.5s ease-in-out;
        }

        .custom-select-button.open {
          border-color: #1B8F7D;
          background-color: rgba(255, 255, 255, 0.98);
        }

        .custom-select-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 0, 0, 0.12);
          border-radius: 12px;
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          max-height: 240px;
          overflow-y: auto;
          z-index: 50;
        }

        .custom-select-option {
          padding: 12px 16px;
          cursor: pointer;
          transition: all 200ms ease;
          color: #1f2937;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .custom-select-option:last-child {
          border-bottom: none;
        }

        .custom-select-option:hover {
          background-color: rgba(38, 181, 160, 0.1);
          color: #02836F;
        }

        .custom-select-option.selected {
          background-color: rgba(2, 131, 111, 0.1);
          color: #02836F;
          font-weight: 500;
        }

        .custom-select-option.placeholder {
          color: #9ca3af;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @media (max-width: 430px) {
          .input-field {
            font-size: 16px;
            padding: 16px;
            border-radius: 16px;
          }
          .custom-select-button {
            font-size: 16px;
            padding: 16px;
            border-radius: 16px;
          }
        }
      `}</style>

      <section id="office-form" className='w-full h-auto px-4 sm:px-8 lg:px-20 py-12'>
        <div className='w-full max-w-5xl mx-auto rounded-lg border border-solid border-[#E1E6EF] bg-[rgba(2,131,111,0.10)] px-4 sm:px-8 md:px-12 lg:px-[106px] flex flex-col justify-center items-center pb-16 sm:pb-24 lg:pb-32 py-12 sm:py-16'>
          <h3 className='w-full max-w-[833px] text-[#1B1F27] text-center text-[24px]/[28px] max-[430px]:text-[18px]/[24px] font-medium mb-12 max-[430px]:mb-8'>
            İnvest Home ailəsinə qoşulun! Öz daşınmaz əmlak ofisinizi açmaq üçün qeydiyyat formasını indi doldurun.
          </h3>
          
          <form onSubmit={formik.handleSubmit} className='w-full flex flex-col gap-7'>
            <div className='flex flex-col md:flex-row md:flex-wrap justify-between gap-7'>
              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                  Adınız / Soyadınız
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="nameSurname"
                  placeholder="Ad Soyad"
                  className={inputClass('nameSurname')}
                  value={formik.values.nameSurname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nameSurname && formik.errors.nameSurname && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.nameSurname}</p>
                )}
              </div>

              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                  Email Adresiniz
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="investhomeaz@gmail.com"
                  className={inputClass('email')}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between gap-7'>
              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                  Doğum Tarixi
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  placeholder="Doğum Tarixi"
                  className={inputClass('birthDate')}
                  value={formik.values.birthDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.birthDate}</p>
                )}
              </div>

              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                  Telefon
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+994 XX XXX XX XX"
                  className={inputClass('phone')}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                )}
              </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between gap-7'>
              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                  Ölkə
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative" ref={countryDropdownRef}>
                  <button
                    type="button"
                    className={`custom-select-button w-full flex items-center justify-between ${
                      formik.touched.country && formik.errors.country ? 'error' : ''
                    } ${isCountryOpen ? 'open' : ''}`}
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                  >
                    <span className={!selectedCountry ? 'text-[#9ca3af]' : 'text-[#1f2937]'}>
                      {selectedCountry ? selectedCountry.name : 'Ölkə seçin'}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCountryOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isCountryOpen && (
                    <div className="custom-select-dropdown">
                      <div
                        className="custom-select-option placeholder"
                        onClick={async () => {
                          await formik.setFieldValue('country', '')
                          await formik.setFieldTouched('country', true, true)
                          setIsCountryOpen(false)
                        }}
                      >
                        Ölkə seçin
                      </div>
                      {countries.map((country) => (
                        <div
                          key={country.id}
                          className={`custom-select-option ${
                            formik.values.country === country.id ? 'selected' : ''
                          }`}
                          onClick={async () => {
                            await formik.setFieldValue('country', country.id)
                            await formik.setFieldTouched('country', true, true)
                            setIsCountryOpen(false)
                          }}
                        >
                          {country.name}
                        </div>
                      ))}
                    </div>
                  )}                                  </div>
                {formik.touched.country && formik.errors.country && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.country}</p>
                )}
              </div>

              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                  Ofis açmaq istədiyiniz ərazi
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="officeLocation"
                  placeholder="Məs: Bakı şəhəri, Xətai rayonu, Ağ şəhər"
                  className={inputClass('officeLocation')}
                  value={formik.values.officeLocation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.officeLocation && formik.errors.officeLocation && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.officeLocation}</p>
                )}
              </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between gap-7'>
              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                 Əmlak Təcrübəniz
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="realEstateExperience"
                  placeholder="Daşınmaz əmlak sahəsindəki təcrübəniz"
                  className={inputClass('realEstateExperience')}
                  value={formik.values.realEstateExperience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.realEstateExperience && formik.errors.realEstateExperience && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.realEstateExperience}</p>
                )}
              </div>

              <div className="flex flex-col gap-[8px] w-full md:flex-1 md:min-w-0">
                <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                  Hal-hazırda fəaliyyət göstərdiyiniz sahə
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="currentField"
                  placeholder="Hal-hazırda hansı sahədə fəaliyyət göstərirsiniz?"
                  className={inputClass('currentField')}
                  value={formik.values.currentField}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.currentField && formik.errors.currentField && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.currentField}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="max-[430px]:hidden text-[16px] font-medium text-[#1B1F27]">
                Əlavə Qeyd
              </label>
              <textarea
                name="additionalNote"
                placeholder="Buraya yazın...."
                className={`${inputClass('additionalNote')} min-h-[164px]`}
                value={formik.values.additionalNote}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.additionalNote && formik.errors.additionalNote && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.additionalNote}</p>
              )}
            </div>

<button
  type="submit"
  disabled={formik.isSubmitting || !formik.isValid}
  className={`w-32 bg-[#02836F] self-end text-white py-3 px-6 rounded-lg font-medium text-[16px] 
    hover:bg-[#026d5c] transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed`}
>
  {formik.isSubmitting ? 'Göndərilir...' : 'Göndər'}
</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default OfficeForm