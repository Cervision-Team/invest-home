import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-full h-full flex items-center justify-center flex-col pt-10'>
      <h4 className='text-[34px]/[46px] max-[430px]:text-[28px]/[36px] font-medium text-black text-center'>
        Ups! Burada heç nə tapılmadı.
      </h4>
      <h5 className='mt-6 max-[430px]:mt-4 text-[24px]/[28px] max-[430px]:text-[18px]/[24px] font-medium text-black text-center'>
        Axtardığınız səhifə mövcud deyil və ya silinmişdir.
      </h5>
      <Image
       src="/icons/not-found.svg"
        alt="Not Found"
         width={860}
         height={364} 
         className='mt-12'/>

      <Link href="/" className="w-full flex justify-center">
      <button
        className="w-full md:w-auto flex-none
        flex items-center justify-center gap-[12px]
        bg-[var(--primary-color)] text-white rounded-[8px]
        py-[14px] px-[34px]
        max-[430px]:mt-[40px] mt-[80px]
        cursor-pointer mb-10"
        >
        <span className="font-[500] text-[16px]">Əsas səhifəyə qayıt</span>
      </button>
        </Link>

    </div>
  )
}