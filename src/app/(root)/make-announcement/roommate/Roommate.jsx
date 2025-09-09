import PropertyTypeButton from '@/components/ui/PropertyTypeButton';
import React, { useState } from 'react'
import "../../../globals.css"

const Roommate = ({ activePropertyType, setActivePropertyType }) => {
    const [activeBuilding, setActiveBuilding] = useState(null);
    const [activeRepaired, setActiveRepaired] = useState(null);
  
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
              isActive={activePropertyType === 'apartmentRoommate'}
              onClick={() => setActivePropertyType('apartmentRoommate')}
              />
              <PropertyTypeButton
              src={"/icons/house-black.svg"}
              srcOnHover={"/icons/house-white.svg"}
              text={"Həyət/ Bağ Evi"}
              isActive={activePropertyType === 'houseRoommate'}
              onClick={() => setActivePropertyType('houseRoommate')}
              />              
              </div>

            </div>
            {activePropertyType && (
              <>
              <div className='w-full flex flex-row items-center justify-start gap-[35px] mt-[28px]'>
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

              <div className='w-full flex flex-row flex-wrap items-center justify-start gap-x-[38px] gap-y-[38px] mt-[40px]'>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="price" className='text-[#000] text-[20px]/[24px]'>Qiyməti</label>
                  <input
                    type="number"
                    id="price"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Qiymət"
                    />
                </div>

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

                    <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="floor" className='text-[#000] text-[20px]/[24px]'>Mərtəbə</label>
                  <input
                    type="number"
                    id="floor"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Mərtəbə"
                    />
                </div>
                    
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="totalFloors" className='text-[#000] text-[20px]/[24px]'>Ümumi mərtəbələr</label>
                  <input
                    type="number"
                    id="totalFloors"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>

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

              </div>
            </>

            )}

          </form>
      </div>
    </>
  )
}

export default Roommate
