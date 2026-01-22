import Image from "next/image";
import FlipCard from "@/components/ui/FlipCard";
import BeAgentNew from "@/components/ui/BeAgentNew";

const page = () => {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-20">
        <div className="pt-6 sm:pt-10">
          <BeAgentNew />
        </div>

        <div className="mt-10 sm:mt-14">
         

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FlipCard
              icon={"/icons/money.svg"}
              heading={"Yüksək Qazanc"}
              description={"İnvest Home Pass Sharing System ilə məsləhətçilərinə yüksək qazanc imkanları təklif edir."}
            />
            <FlipCard
              icon={"/icons/trainings.svg"}
              heading={"Təlimlər"}
              description={"Həftədə iki dəfə müntəzəm təlimlə satış texnikaları tez öyrənilir və Sahə Brokeri onların həyata keçirilməsinə kömək edir."}
            />
            <FlipCard
              icon={"/icons/customer-portfolio.svg"}
              heading={"Müştəri Portfeli"}
              description={"Məsləhətçilərin Azərbaycandakı bütün müştəri bazasına çıxışı var və müştəriləri olmasa belə sektora sürətlə daxil ola bilərlər."}
            />
            <FlipCard
              icon={"/icons/technology.svg"}
              heading={"Yüksək texnologiya"}
              description={"İnvest Home Google® infrastrukturundan və bir çox inteqrasiya olunmuş sənaye texnologiyalarından ən səmərəli istifadə edən şirkətdir."}
            />
            <FlipCard
              icon={"/icons/desk.svg"}
              heading={"Rahat iş mühiti"}
              description={"Müasir və peşəkar iş mühiti ilə məsləhətçilərimiz yalnız öz işlərinə diqqət yetirir, sənədləşmə işləri isə ofisiniz tərəfindən aparılır."}
            />
            <FlipCard
              icon={"/icons/time.svg"}
              heading={"Vaxtın İdarə Edilməsi"}
              description={"Bu, ailənizlə vaxt keçirə biləcəyiniz, öz işinizi və tətil cədvəlinizi təşkil edə biləcəyiniz əla sektordur."}
            />
          </div>

          <div className="mt-14 sm:mt-20 lg:mt-28 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="w-full">
              <Image
                src={"/images/details-about-agents.png"}
                alt="details-about-agents"
                width={900}
                height={900}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="w-full h-auto rounded-2xl bg-white"
              />
            </div>

            <div className="w-full max-w-xl">
              <h2 className="text-[#0A0D14] text-[22px]/[28px] sm:text-[28px]/[34px] font-medium">
                Agent olmaqla əlaqəli başlıca məqamlar
              </h2>

              <ul className="mt-6 list-disc pl-5 space-y-3 text-[#0A0D14] text-[16px]/[24px] sm:text-[18px]/[28px]">
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
