import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className='min-h-screen flex items-center'>
      <div className='py-8 px-5 w-full flex items-center flex-col gap-10'>
        <h4 className='text-[34px]/[46px] max-[430px]:text-[28px]/[36px] font-medium text-black text-center'>
          Ups! Burada heç nə tapılmadı.
        </h4>
        <h5 className='text-[24px]/[28px] max-[430px]:text-[18px]/[24px] font-medium text-black text-center'>
          Axtardığınız səhifə mövcud deyil və ya silinmişdir.
        </h5>
        <div className='w-[50%] flex justify-center max-[768px]:w-[80%]'>
          <Image
            src="/icons/not-found.svg"
            alt="Not Found"
            width={860}
            height={364}
          />
        </div>

        <Link href="/" className="flex justify-center">
          <button
            className="w-full md:w-auto flex-none
        flex items-center justify-center gap-[12px]
        bg-[var(--primary-color)] text-white rounded-[8px]
        py-[14px] px-[34px]
        cursor-pointer"
          >
            <span className="font-[500] text-[16px]">Əsas səhifəyə qayıt</span>
          </button>
        </Link>
      </div>
    </section>
  )
}