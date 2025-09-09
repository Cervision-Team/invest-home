import PropertyTypeButton from '@/components/ui/PropertyTypeButton';
import React, { useState } from 'react'
import "../../../globals.css"

const ForSale = ({ activePropertyType, setActivePropertyType }) => {
  // const [activePropertyType, setActivePropertyType] = useState(null);
  const [activeOfficeType, setActiveOfficeType] = useState(null);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [activeRepaired, setActiveRepaired] = useState(null);
  const [isMortgaged, setIsMortgaged] = useState(false);
  return (
    <>
    <style>
        {`
          .remove-arrow::-webkit-outer-spin-button,
          .remove-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .remove-arrow {
            -moz-appearance: textfield;
          }
        `}
    </style>
      <div className=' h-full flex items-start justify-start gap-[95px] pb-[16px] border-b-[1px] border-[rgba(0,0,0,0.2)] max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]'>
          <form action="">
            <div className='flex flex-col items-start justify-center gap-[30px]'>
              <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
                Xüsusiyyətlər
              </h5>
              <h6 className='text-[#000] text-[20px]/[24px]'>
                Əmlak növü
              </h6>

              <div className=' w-[647px] flex flex-row flex-wrap gap-x-[23px] gap-y-[32px]'>
              <PropertyTypeButton
              src={"/icons/apartment-black.svg"}
              srcOnHover={"/icons/apartment-white.svg"}
              text={"Mənzil"}
              isActive={activePropertyType === 'apartment'}
              onClick={() => setActivePropertyType('apartment')}
              />
              <PropertyTypeButton
              src={"/icons/home-sale-black.svg"}
              srcOnHover={"/icons/home-sale-white.svg"}
              text={"Obyekt"}
              isActive={activePropertyType === 'object'}
              onClick={() => setActivePropertyType('object')}
              />
              <PropertyTypeButton
              src={"/icons/land-black.svg"}
              srcOnHover={"/icons/land-white.svg"}
              text={"Torpaq"}
              isActive={activePropertyType === 'land'}
              onClick={() => setActivePropertyType('land')}
              />
              <PropertyTypeButton
              src={"/icons/house-black.svg"}
              srcOnHover={"/icons/house-white.svg"}
              text={"Həyət/Bağ/Villa"}
              isActive={activePropertyType === 'house'}
              onClick={() => setActivePropertyType('house')}
              />
              <PropertyTypeButton
              src={"/icons/office-black.svg"}
              srcOnHover={"/icons/office-white.svg"}
              text={"Ofis"}
              isActive={activePropertyType === 'office'}
              onClick={() => setActivePropertyType('office')}
              />
              <PropertyTypeButton
              src={"/icons/garage-black.svg"}
              srcOnHover={"/icons/garage-white.svg"}
              text={"Qaraj"}
              isActive={activePropertyType === 'garage'}
              onClick={() => setActivePropertyType('garage')}
              />
              
              </div>

            </div>
            {activePropertyType === 'office' && (
                <div className='flex flex-col items-start justify-center gap-[12px] mt-[36px]'>
                  <h6 className='text-[#000] text-[20px]/[24px]'>
                    Ofisin tipi
                  </h6>

                  <div className='flex flex-row items-center justify-center'>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeOfficeType === 'businessCenter' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setActiveOfficeType('businessCenter')}
                        >
                      Biznes mərkəzi
                    </button>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center border border-solid text-[14px] transition-colors duration-200
                        ${activeOfficeType === 'apartmentOffice' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setActiveOfficeType('apartmentOffice')}
                        >
                      Mənzil
                    </button>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeOfficeType === 'gardenHouse' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setActiveOfficeType('gardenHouse')}
                        >
                      Bağ evi
                    </button>
                  </div>
                </div>

              )}
            {activePropertyType && (
              <>
              {activePropertyType !== 'land' && (
              <div className='w-full flex flex-row items-center justify-start gap-[35px] mt-[28px]'>
                {(activePropertyType === 'apartment' || (activePropertyType === 'office' && activeOfficeType !== 'gardenHouse')) && (
                  <div className='flex flex-col items-start justify-center gap-[12px]'>
                  <h6 className='text-[#000] text-[20px]/[24px]'>
                    Bina
                  </h6>

                  <div className='flex flex-row items-center justify-center'>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeBuilding === 'newBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setActiveBuilding('newBuilding')}
                        >
                      Yeni tikili
                    </button>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeBuilding === 'oldBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setActiveBuilding('oldBuilding')}
                        >
                      Köhnə tikili
                    </button>
                  </div>
                </div>
                    )}

                <div className='flex flex-col items-start justify-center gap-[12px]'>
                  <h6 className='text-[#000] text-[20px]/[24px]'>
                    Təmiri
                  </h6>

                  <div className='flex flex-row items-center justify-center'>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                      ${activeRepaired === 'renewed' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => setActiveRepaired('renewed')}
                    >
                      Təmirli
                    </button>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                      ${activeRepaired === 'notRenewed' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => setActiveRepaired('notRenewed')}
                    >
                      Təmirsiz
                    </button>
                  </div>
                </div>
              </div>
              )}

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[16px]/[20px] font-medium'>Hazırda ipotekadadır?</p>

                <div className='flex flex-row items-center justify-center mt-[9px]'>
                 <input type="radio" id="yes" name="mortgaged" value="yes" className='w-[20px] h-[20px] accent-primary' onChange={() => setIsMortgaged(true)}/>
                 <label htmlFor="yes" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Bəli</label>
                  <input type="radio" id="no" name="mortgaged" value="no" className=' ml-[60px] w-[20px] h-[20px] accent-primary' onChange={() => setIsMortgaged(false)}/>
                  <label htmlFor="no" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Xeyr</label>

                </div>
              </div>

              {isMortgaged && (
                <div className='flex flex-col items-start justify-center gap-[18px] mt-[40px]'>
                <p className='text-[#000] text-[16px]/[20px] font-medium'>İpoteka detalları</p>

                <div className='w-full flex flex-row items-center justify-start gap-[24px]'>
                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="initialPayment" className='text-[#000] text-[16px]/[20px]'>İlkin ödəniş</label>
                    <input
                      type="number"
                      id="initialPayment"
                      className="w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                      placeholder="Məs: 10000"
                    />
                  </div>
                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="monthlyPayment" className='text-[#000] text-[16px]/[20px]'>Aylıq ödəniş</label>
                    <input
                      type="number"
                      id="monthlyPayment"
                      className="w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                      placeholder="Məs: 500"
                    />
                  </div>

                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="remainingYears" className='text-[#000] text-[16px]/[20px]'>Qalıq il</label>
                    <input
                      type="number"
                      id="remainingYears"
                      className="w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                      placeholder="Məs: 10"
                    />
                  </div>

                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="remainingMonths" className='text-[#000] text-[16px]/[20px]'>Qalıq ay</label>
                    <input
                      type="number"
                      id="remainingMonths"
                      className="w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                      placeholder="Məs: 6"
                    />
                  </div>
                </div>
                              </div>

              )}


              <div className='w-full flex flex-row flex-wrap items-center justify-start gap-x-[38px] gap-y-[38px] mt-[40px]'>
                {activePropertyType !== 'land' && (
                  <div className="flex flex-col items-start justify-center gap-2">
                   <label htmlFor="area" className="text-[#000] text-[20px]/[24px]">
                     Sahə
                   </label>
                   <div className="relative w-[350px]">
                     <input
                       type="number"
                       id="area"
                       className="w-full h-10 pr-12 pl-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                       placeholder="Sahə"
                     />
                     <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                       m²
                     </span>
                   </div>
                 </div>
                  )}

                 {(activePropertyType === 'house' || activePropertyType === 'land' || (activePropertyType === "office" && activeOfficeType === 'gardenHouse')) && (
                   <div className="flex flex-col items-start justify-center gap-2">
                   <label htmlFor="landArea" className="text-[#000] text-[20px]/[24px]">
                     Torpağın sahəsi
                   </label>
                   <div className="relative w-[350px]">
                     <input
                       type="number"
                       id="landArea"
                       className="w-full h-10 pr-12 pl-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                       placeholder="Sahə"
                     />
                     <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                       m²
                     </span>
                   </div>
                 </div>
                )}

                  {(activePropertyType === 'apartment' || (activePropertyType === 'office' && activeOfficeType !== 'gardenHouse')) && (
                    <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="floor" className='text-[#000] text-[20px]/[24px]'>Mərtəbə</label>
                  <input
                    type="number"
                    id="floor"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Mərtəbə"
                    />
                </div>
                  )}
                  {(activePropertyType === 'apartment' || activePropertyType === 'house' || activePropertyType === 'office') && (
                    
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="totalFloors" className='text-[#000] text-[20px]/[24px]'>Ümumi mərtəbələr</label>
                  <input
                    type="number"
                    id="totalFloors"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>
                                  )}

               {(activePropertyType === 'apartment' || activePropertyType === 'house' || (activePropertyType === 'office' && activeOfficeType !== 'businessCenter')) && (
                <>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="rooms" className='text-[#000] text-[20px]/[24px]'>Otaq</label>
                  <input
                    type="number"
                    id="rooms"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="bathrooms" className='text-[#000] text-[20px]/[24px]'>Sanitar qovşağı</label>
                  <input
                    type="number"
                    id="bathrooms"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>
                </>
                  )}



                {(activePropertyType === 'house' || activePropertyType === 'land' || activePropertyType === 'garage' || (activePropertyType === 'office' && activeOfficeType === 'apartmentOffice')) && (
                  <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="price" className='text-[#000] text-[20px]/[24px]'>Qiyməti</label>
                  <input
                    type="number"
                    id="price"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Qiymət"
                    />
                </div>
                  )}


              </div>
            </>

            )}

          </form>
      </div>
    
    </>)
}

export default ForSale
