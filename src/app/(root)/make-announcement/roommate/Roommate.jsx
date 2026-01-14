import PropertyTypeButton from '@/components/ui/PropertyTypeButton';
import React, { useState, useEffect, useCallback } from 'react';
import "../../../globals.css";
import { getValidationSchema } from '@/lib/schemas/announcementSchema';

const Roommate = ({
  formik,
  stepErrors = {},
  setStepErrors,
  isValidating,
  activePropertyType,
  setActivePropertyType
}) => {
  const [activeBuilding, setActiveBuilding] = useState(formik?.values?.buildingType || null);
  const [activeRepaired, setActiveRepaired] = useState(formik?.values?.repairStatus || null);

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

  const clearFieldsForPropertyType = useCallback(
    (propertyType) => {
      const allFields = [
        'buildingType',
        'repairStatus',
        'area',
        'floor',
        'totalFloors',
        'rooms',
        'bathrooms',
        'landArea',
        'garageSize'
      ];

      let fieldsToClear = [];

      if (propertyType === 'apartmentRoommate') {
        fieldsToClear = ['landArea', 'garageSize'];
      } else if (propertyType === 'houseRoommate') {
        fieldsToClear = ['garageSize'];
      } else {
        fieldsToClear = allFields;
      }

    fieldsToClear.forEach((field) => {
      formik.setFieldValue(field, '');
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
  
      
  
    const updateBuildingType = useCallback((type) => {
      setActiveBuilding(type);
      formik.setFieldValue('buildingType', type);
      clearErrorForField('buildingType');
    }, [formik, clearErrorForField]);
  
    const updateRepairStatus = useCallback((status) => {
      setActiveRepaired(status);
      formik.setFieldValue('repairStatus', status);
      clearErrorForField('repairStatus');
    }, [formik, clearErrorForField]);
  
  
    const displayedErrors = { ...(localErrors || {}), ...(stepErrors || {}) };
  
    const getErrorMessage = (fieldName) => displayedErrors[fieldName];
    const hasError = (fieldName) => !!displayedErrors[fieldName];
  
    // useEffect(() => {
    //   setActiveBuilding(formik?.values?.buildingType || null);
    //   setActiveRepaired(formik?.values?.repairStatus || null);
    // }, [formik?.values?.buildingType, formik?.values?.repairStatus]);

useEffect(() => {
  const { buildingType, repairStatus } = formik.values;

  setActiveBuilding(prev =>
    prev === buildingType ? prev : buildingType || null
  );
  setActiveRepaired(prev =>
    prev === repairStatus ? prev : repairStatus || null
  );
}, [formik.values])    
  
  return (
    <>
      <style>
        {`
                        .input-field {
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
            position:absolute;
            bottom: -24px;
          }
        `}
      </style>
      <div className='flex flex-col justify-center gap-[30px] h-full border-[rgba(0,0,0,0.2)] overflow-y-auto hide-scrollbar pl-[2px]'>
        <div className='flex flex-col gap-[30px]'>
          <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
            Xüsusiyyətlər
          </h5>
          <h6 className='text-[#000] text-[20px]/[24px]'>
            Əmlak növü
          </h6>
        </div>
        <form>
          <div className='grid max-[890px]:grid-cols-1 max-[1230px]:grid-cols-[193px_193px] grid-cols-[193px_193px_193px] gap-x-[23px] gap-y-[32px]'>
            <PropertyTypeButton
              src={"/icons/apartment-black.svg"}
              srcOnHover={"/icons/apartment-white.svg"}
              text={"Mənzil"}
              isActive={activePropertyType === 'apartmentRoommate'}
              onClick={() => updatePropertyType('apartmentRoommate')}
            />
            <PropertyTypeButton
              src={"/icons/house-black.svg"}
              srcOnHover={"/icons/house-white.svg"}
              text={"Həyət/ Bağ Evi"}
              isActive={activePropertyType === 'houseRoommate'}
              onClick={() => updatePropertyType('houseRoommate')}
            />
          </div>
          {activePropertyType && (
            <>
              <div className='grid grid-cols-2 max-[1365px]:grid-cols-1 gap-[35px] mt-[28px]'>
                <div className='grid gap-[12px] relative'>
                  <h6 className='text-[#000] text-[20px]/[24px]'>Bina</h6>
                  <div className='grid grid-cols-[181px_181px] max-[890px]:grid-cols-2 max-[768px]:grid-cols-[181px_181px] max-[460px]:grid-cols-1 max-[460px]:gap-[23px]'>
                    <button
                      type="button"
                      className={` h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                            ${activeBuilding === 'newBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => updateBuildingType('newBuilding')}
                    >
                      Yeni tikili
                    </button>
                    <button
                      type="button"
                      className={` h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                            ${activeBuilding === 'oldBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => updateBuildingType('oldBuilding')}
                    >
                      Köhnə tikili
                    </button>
                  </div>
                  {hasError('buildingType') && <p className="error-text">{getErrorMessage('buildingType')}</p>}
                </div>

                <div className='grid gap-[12px] relative'>
                  <h6 className='text-[#000] text-[20px]/[24px]'>Təmiri</h6>

                  <div className='grid grid-cols-[181px_181px] max-[890px]:grid-cols-2 max-[768px]:grid-cols-[181px_181px] max-[460px]:grid-cols-1 max-[460px]:gap-[23px]'>
                    <button
                      type="button"
                      className={` h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeRepaired === 'renewed' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => updateRepairStatus('renewed')}
                    >
                      Təmirli
                    </button>
                    <button
                      type="button"
                      className={` h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeRepaired === 'notRenewed' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => updateRepairStatus('notRenewed')}
                    >
                      Təmirsiz
                    </button>
                  </div>
                  {hasError('repairStatus') && <p className="error-text">{getErrorMessage('repairStatus')}</p>}
                </div>
              </div>

              <div className='grid grid-cols-3 max-[1260px]:grid-cols-2 max-[1030px]:grid-cols-1 max-[768px]:grid-cols-2 max-[550px]:grid-cols-1 gap-x-[38px] gap-y-[38px] mt-[40px]'>
                <div className='grid gap-2 relative'>
                  <label htmlFor="price" className='text-[#000] text-[20px]/[24px]'>Qiyməti</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="price"
                      value={formik.values.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      onBlur={() => handleBlur("price")}
                      className={`w-full h-10 pr-16 pl-[10px] py-2 input-field remove-arrow ${hasError('price') ? 'error' : 'border-black'}`}
                      placeholder="Qiymət"
                    />
                  </div>
                  {hasError('price') && <p className="error-text">{getErrorMessage('price')}</p>}
                </div>

                <div className="grid gap-2 relative">
                  <label htmlFor="area" className="text-[#000] text-[20px]/[24px]">Sahə</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="area"
                      value={formik.values.area || ''}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      onBlur={() => handleBlur("area")}
                      className={`w-full h-10 pr-12 pl-[10px] py-2 input-field remove-arrow ${hasError('area') ? 'error' : 'border-black'}`}
                      placeholder="Sahə"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">m²</span>
                  </div>
                  {hasError('area') && <p className="error-text">{getErrorMessage('area')}</p>}
                </div>

                <div className='grid gap-2 relative'>
                  <label htmlFor="floor" className='text-[#000] text-[20px]/[24px]'>Mərtəbə</label>
                  <input
                    type="number"
                    id="floor"
                    value={formik.values.floor || ''}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    onBlur={() => handleBlur("floor")}
                    className={`w-full h-10 px-[10px] py-2 input-field remove-arrow ${hasError('floor') ? 'error' : 'border-black'}`}
                    placeholder="Mərtəbə"
                  />
                  {hasError('floor') && <p className="error-text">{getErrorMessage('floor')}</p>}
                </div>

                <div className='grid gap-2 relative'>
                  <label htmlFor="totalFloors" className='text-[#000] text-[20px]/[24px]'>Ümumi mərtəbələr</label>
                  <input
                    type="number"
                    id="totalFloors"
                    value={formik.values.totalFloors || ''}
                    onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                    onBlur={() => handleBlur("totalFloors")}
                    className={`w-full h-10 px-[10px] py-2 input-field remove-arrow ${hasError('totalFloors') ? 'error' : 'border-black'}`}
                    placeholder="Sayı"
                  />
                  {hasError('totalFloors') && <p className="error-text">{getErrorMessage('totalFloors')}</p>}
                </div>

                <div className='grid gap-2 relative'>
                  <label htmlFor="rooms" className='text-[#000] text-[20px]/[24px]'>Otaq</label>
                  <input
                    type="number"
                    id="rooms"
                    value={formik.values.rooms || ''}
                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                    onBlur={() => handleBlur("rooms")}
                    className={`w-full h-10 px-[10px] py-2 input-field remove-arrow ${hasError('rooms') ? 'error' : 'border-black'}`}
                    placeholder="Sayı"
                  />
                  {hasError('rooms') && <p className="error-text">{getErrorMessage('rooms')}</p>}
                </div>

                <div className='grid gap-2 relative'>
                  <label htmlFor="bathrooms" className='text-[#000] text-[20px]/[24px]'>Sanitar qovşağı</label>
                  <input
                    type="number"
                    id="bathrooms"
                    value={formik.values.bathrooms || ''}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    onBlur={() => handleBlur("bathrooms")}
                    className={`w-full h-10 px-[10px] py-2 input-field remove-arrow ${hasError('bathrooms') ? 'error' : 'border-black'}`}
                    placeholder="Sayı"
                  />
                  {hasError('bathrooms') && <p className="error-text">{getErrorMessage('bathrooms')}</p>}
                </div>

              </div>
            </>

          )}

        </form>
      </div>
    </>
  )
}

export default Roommate
