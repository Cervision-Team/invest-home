import Image from "next/image"
import Link from "next/link"
import FlipCard from "@/components/ui/FlipCard"
import BeAgent from "../../Home/BeAgent"
import BeAgentNew from "@/components/ui/BeAgentNew"

const page = () => {
  return (
    <>
      <section className="w-full mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
       <div style={{ marginTop: "-88px" }}>
         <BeAgentNew />
       </div>
        <div className='w-full h-auto flex flex-col items-center justify-center max-[430px]:mt-10 mt-15'>
          {/* <h1 className='max-w-[673px] text-[#0A0D14] text-center text-[34px]/[46px] max-[412px]:text-[28px]/[46px] font-medium'>
            Agent olmaqla əlaqəli başlıca məqamlar
          </h1> */}
          <div className="w-full h-auto flex max-[1153px]:flex-col flex-wrap flex-row items-start justify-between max-[430px]:mt-10 mt-15 gap-[24px] ">
            <FlipCard 
            icon={"/icons/money.svg"}
            heading={"Yüksək Qazanc"}/>
            <FlipCard 
            icon={"/icons/trainings.svg"}
            heading={"Təlimlər"}/>
            <FlipCard 
            icon={"/icons/customer-portfolio.svg"}
            heading={"Müştəri Portfeli"}/>
            <FlipCard 
            icon={"/icons/technology.svg"}
            heading={"Yüksək texnologiya"}/>
            <FlipCard 
            icon={"/icons/desk.svg"}
            heading={"Rahat iş mühiti"}/>
            <FlipCard 
            icon={"/icons/time.svg"}
            heading={"Vaxtın İdarə Edilməsi"}/>
          </div>

{/* <Link href="/become-agent/agent-form" className="w-full flex justify-center">
  <button
    className="w-full md:w-auto flex-none
               flex items-center justify-center gap-[12px]
               bg-[var(--primary-color)] text-white rounded-[8px]
               py-[14px] px-[34px]
               max-[430px]:mt-[40px] mt-[80px]
               cursor-pointer"
  >
    <span className="font-[500] text-[16px]">Forma keçid</span>
    <Image src={arrowRightWhite} alt="Arrow Right White" />
  </button>
</Link> */}

        <div className="w-full flex flex-row justify-start"
         style={{ marginTop: "160px", gap: "150px" }}>
             <Image
           src={"/images/details-about-agents.png"}
           alt="details-about-agents"
           width={500}
           height={500}
           />
           <div className="h-full flex flex-col"
            style={{ maxWidth: "520px" }}>
            <h4 className="text-[#0A0D14] text-[32px] font-medium ">
              Agent olmaqla əlaqəli başlıca məqamlar
            </h4>

            <ul className="list-disc flex flex-col gap-[15px] text-[#0A0D14] text-[24px] mt-[36px]"
             style={{ paddingLeft: "24px" }}>
              <li>Məsuliyyət və Etibar</li>
              <li>Hüquqi və Etik Çərçivə</li>
              <li>Kommunikasiya Bacarığı</li>
              <li>Bazar və Sahə Bilikləri</li>
              <li>Nəticə Yönümlülük</li>
              <li>Peşəkarlıq və Özünü İnkişaf</li>
            </ul>

           </div>
         </div>

           </div>
      </section>
    </>
  )
}

export default page
