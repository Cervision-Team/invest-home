import PropertyTypeButton from '@/components/ui/PropertyTypeButton';
import React, { useState, useEffect, useCallback } from 'react';
import "../../../globals.css";
import { getValidationSchema } from '@/lib/schemas/announcementSchema';

const Daily = ({
  formik,
  stepErrors = {},
  setStepErrors,
  isValidating,
  activePropertyType,
  setActivePropertyType
}) => {
  const [activeBuilding, setActiveBuilding] = useState(formik?.values?.buildingType || null);
  const [localErrors, setLocalErrors] = useState({});

  const clearErrorForField = useCallback((fieldName) => {
    if (typeof setStepErrors === 'function') {
      setStepErrors(prev => {
        if (!prev || !prev[fieldName]) return prev || {};
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setLocalErrors(prev => {
        if (!prev || !prev[fieldName]) return prev || {};
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, [setStepErrors]);

  const handleInputChange = useCallback((fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    clearErrorForField(fieldName);
  }, [formik, clearErrorForField]);


  const handleBlur = useCallback(async (fieldName) => {
    const currentValues = formik.values;
    const schema = getValidationSchema(1, 'default', currentValues);

    try {
      await schema.validateAt(fieldName, currentValues);
      clearErrorForField(fieldName);
    } catch (err) {
      const message = err.message;
      setStepErrors
        ? setStepErrors((p) => ({ ...p, [fieldName]: message }))
        : setLocalErrors((p) => ({ ...p, [fieldName]: message }));
    }
  }, [formik, clearErrorForField, setStepErrors]);
  // Clear specific fields based on property type changes
  // const clearFieldsForPropertyType = useCallback((propertyType) => {
  //   const fieldsToAlwaysClear = [ 'buildingType'];

  //   let fieldsToClear = [...fieldsToAlwaysClear];

  //   if (propertyType === 'land') {
  //     fieldsToClear.push('area', 'repairStatus', 'floor', 'totalFloors', 'rooms', 'bathrooms');
  //   } else if (propertyType === 'house') {
  //     fieldsToClear.push('floor', 'buildingType');
  //   } else if (propertyType === 'garage') {
  //     fieldsToClear.push('landArea', 'rooms', 'bathrooms');
  //   } else if (propertyType === 'apartment') {
  //     fieldsToClear.push('landArea');
  //   }

  //   fieldsToClear.forEach(field => {
  //     formik.setFieldValue(field, '');
  //     clearErrorForField(field);
  //   });
  // }, [formik, clearErrorForField]);

  const clearFieldsForPropertyType = useCallback(
    (propertyType) => {
      const fieldsToAlwaysClear = ["buildingType"];

      const fieldsToClear = [...fieldsToAlwaysClear];

      if (propertyType === "apartmentDaily") {
        fieldsToClear.push("landArea", "rooms");
      } else if (propertyType === "aframe") {
        fieldsToClear.push("floor", "landArea");
      } else {
        fieldsToClear.push("floor");
        fieldsToClear.push("totalFloors");
      }

      fieldsToClear.forEach((field) => {
        formik.setFieldValue(field, "");
        clearErrorForField(field);
      });
    },
    [formik, clearErrorForField]
  );

  
    const updatePropertyType = useCallback((type) => {
      setActivePropertyType(type);
      formik.setFieldValue('propertyType', type);
      clearErrorForField('propertyType');
      
      clearFieldsForPropertyType(type);
      
    }, [setActivePropertyType, formik, clearErrorForField, clearFieldsForPropertyType, activePropertyType]);
  
    // Updated office type handler
    // const updateOfficeType = useCallback((type) => {
    //   setActiveOfficeType(type);
    //   formik.setFieldValue('officeType', type);
    //   clearErrorForField('officeType');
      
    //   if (type === 'gardenHouse') {
    //     formik.setFieldValue('buildingType', '');
    //     setActiveBuilding(null);
    //     clearErrorForField('buildingType');
    //   }
    // }, [formik, clearErrorForField]);
  
    const updateBuildingType = useCallback((type) => {
      setActiveBuilding(type);
      formik.setFieldValue('buildingType', type);
      clearErrorForField('buildingType');
    }, [formik, clearErrorForField]);
  
  
      
  
    const displayedErrors = { ...(localErrors || {}), ...(stepErrors || {}) };
  
    const getErrorMessage = (fieldName) => displayedErrors[fieldName];
    const hasError = (fieldName) => !!displayedErrors[fieldName];
  
useEffect(() => {
  const current = formik.values.buildingType || null;
  setActiveBuilding(prev => (prev === current ? prev : current));
}, [formik.values.buildingType]); // keep .values.buildingType not the optional chain
  
    const shouldShowField = useCallback((fieldName) => {
      switch (fieldName) {

      case "guestCount":
      case "nightCount":
      case "dailyRate":
      case "bathrooms":
        return true;

      case "area":
        return true;

      case "landArea":
        return activePropertyType !== "apartmentDaily";

      case "floor":
        return activePropertyType === "apartmentDaily";

      case "totalFloors":
        return (
          activePropertyType === "apartmentDaily" ||
          activePropertyType === "aframe"
        );

      case "rooms":
        return activePropertyType !== "apartmentDaily";

      case "checkInTime":
      case "checkOutTime":
        return true;
      case 'buildingType':
        return activePropertyType === 'apartmentDaily';


      default:
        return true;
    }
  }, [activePropertyType]);


  return (
    <>
      <style>
        {`
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

          .remove-arrow::-webkit-outer-spin-button,
          .remove-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .remove-arrow {
            -moz-appearance: textfield;
          }
           .error-text {
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
          }

        `}
      </style>
      <div className='flex flex-col justify-center gap-[30px] h-full border-b-[1px] border-[rgba(0,0,0,0.2)] overflow-y-auto hide-scrollbar pl-[2px]'>
        <div className='flex flex-col gap-[30px]'>
          <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
            Xüsusiyyətlər
          </h5>
          <h6 className='text-[#000] text-[20px]/[24px]'>
            Əmlak növü
          </h6>
        </div>
        <form className='mb-[23px]'>
          <div className='grid max-[890px]:grid-cols-1 max-[1230px]:grid-cols-[193px_193px] grid-cols-[193px_193px_193px] gap-x-[23px] gap-y-[32px]'>
            <PropertyTypeButton
              src={"/icons/apartment-black.svg"}
              srcOnHover={"/icons/apartment-white.svg"}
              text={"Mənzil"}
              isActive={activePropertyType === 'apartmentDaily'}
              onClick={() => updatePropertyType('apartmentDaily')}
            />
            <PropertyTypeButton
              src={"/icons/house-black.svg"}
              srcOnHover={"/icons/house-white.svg"}
              text={"Bağ Evi"}
              isActive={activePropertyType === 'gardenHouse'}
              onClick={() => updatePropertyType('gardenHouse')}
            />
            <PropertyTypeButton
              src={"/icons/aframe-black.svg"}
              srcOnHover={"/icons/aframe-white.svg"}
              text={"A frame"}
              isActive={activePropertyType === 'aframe'}
              onClick={() => updatePropertyType('aframe')}
            />
            <PropertyTypeButton
              src={"/icons/kotej-black.svg"}
              srcOnHover={"/icons/kotej-white.svg"}
              text={"Kotej"}
              isActive={activePropertyType === 'kotej'}
              onClick={() => updatePropertyType('kotej')}
            />
            <PropertyTypeButton
              src={"/icons/room-black.svg"}
              srcOnHover={"/icons/room-white.svg"}
              text={"Otaq"}
              isActive={activePropertyType === 'room'}
              onClick={() => updatePropertyType('room')}
            />
          </div>
          {activePropertyType && (
            <>
              {activePropertyType === 'apartmentDaily' && (
                <div className='grid grid-cols-2 max-[1365px]:grid-cols-1 gap-[35px] mt-[28px]'>
                  {shouldShowField('buildingType') && (
                    <div className='grid gap-[12px]'>
                      <h6 className='text-[#000] text-[20px]/[24px]'>Bina</h6>

                      <div className='grid grid-cols-[181px_181px] max-[890px]:grid-cols-2 max-[768px]:grid-cols-[181px_181px] max-[460px]:grid-cols-1 max-[460px]:gap-[23px]'>
                        <button
                          type="button"
                          className={`h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                            ${activeBuilding === 'newBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                          onClick={() => updateBuildingType('newBuilding')}
                        >
                          Yeni tikili
                        </button>
                        <button
                          type="button"
                          className={`h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                            ${activeBuilding === 'oldBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                          onClick={() => updateBuildingType('oldBuilding')}
                        >
                          Köhnə tikili
                        </button>
                      </div>
                      {hasError('buildingType') && <p className="error-text">{getErrorMessage('buildingType')}</p>}
                    </div>
                  )}
                </div>
              )}

              <div className='w-full grid grid-cols-[350px_350px] max-[1340px]:grid-cols-2 max-[1090px]:grid-cols-1 max-[768px]:grid-cols-2 max-[540px]:grid-cols-1 gap-x-[38px] gap-y-[38px] mt-[40px]'>

                <div className='grid gap-2'>
                  <label htmlFor="guestCount" className='text-[#000] text-[20px]/[24px]'>Qonaq sayı</label>
                  <input
                    type="number"
                    id="guestCount"
                    value={formik.values.guestCount || ''}
                    onChange={(e) => handleInputChange('guestCount', e.target.value)}
                    onBlur={() => handleBlur("guestCount")}
                    className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('guestCount') ? 'error' : 'border-black'}`}
                    placeholder="Sayı"
                  />
                  {hasError('guestCount') && <p className="error-text">{getErrorMessage('guestCount')}</p>}
                </div>

                <div className='grid gap-2'>
                  <label htmlFor="nightCount" className='text-[#000] text-[20px]/[24px]'>Gecə sayı</label>
                  <input
                    type="number"
                    id="nightCount"
                    value={formik.values.nightCount || ''}
                    onChange={(e) => handleInputChange('nightCount', e.target.value)}
                    onBlur={() => handleBlur("nightCount")}
                    className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('nightCount') ? 'error' : 'border-black'}`}
                    placeholder="Sayı"
                  />
                  {hasError('nightCount') && <p className="error-text">{getErrorMessage('nightCount')}</p>}
                </div>

                <div className='grid gap-2'>
                  <label htmlFor="checkInTime" className='text-[#000] text-[20px]/[24px]'>Giriş vaxtı</label>
                  <input
                    type="number"
                    id="checkInTime"
                    value={formik.values.checkInTime || ''}
                    onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    onBlur={() => handleBlur("checkInTime")}
                    className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('checkInTime') ? 'error' : 'border-black'}`}
                    placeholder="01.01.2025, 00:00"
                  />
                  {hasError('checkInTime') && <p className="error-text">{getErrorMessage('checkInTime')}</p>}
                </div>

                <div className='grid gap-2'>
                  <label htmlFor="checkOutTime" className='text-[#000] text-[20px]/[24px]'>Çıxış vaxtı</label>
                  <input
                    type="number"
                    id="checkOutTime"
                    value={formik.values.checkOutTime || ''}
                    onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                    onBlur={() => handleBlur("checkOutTime")}
                    className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('checkOutTime') ? 'error' : 'border-black'}`}
                    placeholder="01.01.2025, 00:00"
                  />
                  {hasError('checkOutTime') && <p className="error-text">{getErrorMessage('checkOutTime')}</p>}
                </div>

                <div className='grid gap-2'>
                  <label htmlFor="dailyRate" className='text-[#000] text-[20px]/[24px]'>Qiyməti</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="dailyRate"
                      value={formik.values.dailyRate || ''}
                      onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                      onBlur={() => handleBlur("dailyRate")}
                      className={`min-w-0 w-full h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('dailyRate') ? 'error' : 'border-black'}`}
                      placeholder="Qiymət"
                    />
                  </div>
                  {hasError('dailyRate') && <p className="error-text">{getErrorMessage('dailyRate')}</p>}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="area" className="text-[#000] text-[20px]/[24px]">Sahə</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="area"
                      value={formik.values.area || ''}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      onBlur={() => handleBlur("area")}
                      className={`min-w-0 w-full h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('area') ? 'error' : 'border-black'}`}
                      placeholder="Sahə"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">m²</span>
                  </div>
                  {hasError('area') && <p className="error-text">{getErrorMessage('area')}</p>}
                </div>

                {shouldShowField('landArea') && (
                  <div className="grid gap-2">
                    <label htmlFor="landArea" className="text-[#000] text-[20px]/[24px]">Torpağın sahəsi</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="landArea"
                        value={formik.values.landArea || ''}
                        onChange={(e) => handleInputChange('landArea', e.target.value)}
                        onBlur={() => handleBlur("landArea")}
                        className={`min-w-0 w-full h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('landArea') ? 'error' : 'border-black'}`}
                        placeholder="Sahə"
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">m²</span>
                    </div>
                    {hasError('landArea') && <p className="error-text">{getErrorMessage('landArea')}</p>}
                  </div>
                )}

                {shouldShowField('floor') && (
                  <div className='grid gap-2'>
                    <label htmlFor="floor" className='text-[#000] text-[20px]/[24px]'>Mərtəbə</label>
                    <input
                      type="number"
                      id="floor"
                      value={formik.values.floor || ''}
                      onChange={(e) => handleInputChange('floor', e.target.value)}
                      onBlur={() => handleBlur("floor")}
                      className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('floor') ? 'error' : 'border-black'}`}
                      placeholder="Mərtəbə"
                    />
                    {hasError('floor') && <p className="error-text">{getErrorMessage('floor')}</p>}
                  </div>
                )}

                {shouldShowField('totalFloors') && (
                  <div className='grid gap-2'>
                    <label htmlFor="totalFloors" className='text-[#000] text-[20px]/[24px]'>Ümumi mərtəbələr</label>
                    <input
                      type="number"
                      id="totalFloors"
                      value={formik.values.totalFloors || ''}
                      onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                      onBlur={() => handleBlur("totalFloors")}
                      className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('totalFloors') ? 'error' : 'border-black'}`}
                      placeholder="Sayı"
                    />
                    {hasError('totalFloors') && <p className="error-text">{getErrorMessage('totalFloors')}</p>}
                  </div>
                )}

                {shouldShowField('rooms') && (
                  <div className='grid gap-2'>
                    <label htmlFor="rooms" className='text-[#000] text-[20px]/[24px]'>Otaq</label>
                    <input
                      type="number"
                      id="rooms"
                      value={formik.values.rooms || ''}
                      onChange={(e) => handleInputChange('rooms', e.target.value)}
                      onBlur={() => handleBlur("rooms")}
                      className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('rooms') ? 'error' : 'border-black'}`}
                      placeholder="Sayı"
                    />
                    {hasError('rooms') && <p className="error-text">{getErrorMessage('rooms')}</p>}
                  </div>
                )}


                <div className='grid gap-2'>
                  <label htmlFor="bathrooms" className='text-[#000] text-[20px]/[24px]'>Sanitar qovşağı</label>
                  <input
                    type="number"
                    id="bathrooms"
                    value={formik.values.bathrooms || ''}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    onBlur={() => handleBlur("bathrooms")}
                    className={`min-w-0 h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('bathrooms') ? 'error' : 'border-black'}`}
                    placeholder="Sayı"
                  />
                  {hasError('bathrooms') && <p className="error-text">{getErrorMessage('bathrooms')}</p>}
                </div>
              </div>
            </>
          )}

        </form>
      </div>

    </>)
}

export default Daily
