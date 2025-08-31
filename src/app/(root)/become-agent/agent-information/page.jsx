import Image from "next/image"
import arrowRightWhite from "../../../../../public/icons/arrow-right-white-small.svg"
import InformationAccordion from "@/components/ui/InformationAccordion"
import Link from "next/link"

const page = () => {
  return (
    <>
      <div className='w-full h-auto px-[80px] flex flex-col items-center justify-center mt-15'>
        <h1 className='max-w-[673px] text-[#0A0D14] text-center text-[34px]/[46px] font-medium'>
            Agent olmaqla əlaqəli başlıca məqamlar
        </h1>
        <div className="w-full h-auto flex flex-row items-start justify-between mt-15">
        <InformationAccordion />
        <InformationAccordion />
        </div>
        
        <Link href={"/become-agent/agent-form"}>
        <button className='cursor-pointer flex items-center gap-[12px] bg-[var(--primary-color)] text-[white] rounded-[8px] py-[12px] px-[34px] mt-[80px]'>
            <span className='font-[500] text-[16px]'>Forma keçid</span>
            <Image
              src={arrowRightWhite}
              alt="Arrow Right White"
            />
        </button>
         </Link>

      </div>
    </>
  )
}

export default page
