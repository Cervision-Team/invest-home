import Image from "next/image";
import BusStopPrimary from "../../../../public/icons/bus-stop-primary.svg";
import BusStopWhite from "../../../../public/icons/bus-stop-white.svg";
import EstablishmentsButton from '@/components/ui/EstablishmentsButton';
import hospital from "../../../../public/icons/hospital-svg.svg";
import school from "../../../../public/icons/school-svg.svg";
import park from "../../../../public/icons/park-svg.svg";
import metro from "../../../../public/icons/metro-svg.svg";
import restaurant from "../../../../public/icons/restaurant-svg.svg";
import marketplace from "../../../../public/icons/marketplace-svg.svg";
import hospitalWhite from "../../../../public/icons/hospital-white.svg";
import schoolWhite from "../../../../public/icons/school-white.svg";
import parkWhite from "../../../../public/icons/park-white.svg";
import metroWhite from "../../../../public/icons/metro-white.svg";
import restaurantWhite from "../../../../public/icons/restaurant-white.svg";
import marketplaceWhite from "../../../../public/icons/marketplace-white.svg";

const items = [
  { icon: BusStopPrimary, iconHover: BusStopWhite, width: 24, height: 24, name: "Dayanacaq" },
  { icon: hospital, iconHover: hospitalWhite, width: 24, height: 24, name: "Klinika" },
  { icon: school, iconHover: schoolWhite, width: 24, height: 24, name: "Məktəb" },
  { icon: park, iconHover: parkWhite, width: 24, height: 24, name: "Park" },
  { icon: metro, iconHover: metroWhite, width: 24, height: 24, name: "Metro" },
  { icon: restaurant, iconHover: restaurantWhite, width: 24, height: 24, name: "Restoran" },
  { icon: marketplace, iconHover: marketplaceWhite, width: 24, height: 24, name: "Market" },
];

const Map = () => {
  return (
    <section className='max-w-[1600px] mx-[auto]'>
      <div className='w-full px-4 sm:px-8 lg:px-20 flex flex-col items-start justify-center'>
        <h1 className="text-[#111] text-[24px] sm:text-[28px] font-medium">
          Yaxınlıqdakılar
        </h1>

        <div className="flex flex-wrap gap-4 sm:gap-6 mt-[32px] mb-[35px]">
          {items.map((item) => (
            <EstablishmentsButton
              key={item.name}
              icon={item.icon}
              iconHover={item.iconHover}
              width={item.width}
              height={item.height}
              name={item.name}
            />
          ))}
        </div>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24236.414997399468!2d49.844775562309536!3d40.405880488250126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d7fc050f3e5%3A0xfc80fae5b4fa5c0a!2zQXrJmXJiYXljYW4gxLBubm92YXNpeWEgTcmZcmvJmXpp!5e0!3m2!1str!2saz!4v1752733537261!5m2!1str!2saz"
          width="1060"
          height="476"
          className="w-full h-[300px] sm:h-[400px] lg:h-[476px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        <div className="flex flex-row items-center gap-[6px] mt-[38px]">
          <Image
            src={BusStopPrimary}
            alt="bus"
            width={24}
            height={24} />

          <h1 className="text-[#111] text-[18px]/[16px] font-medium">
            Dayanacaq
          </h1>
        </div>

        <div className="w-full sm:w-[411px] flex flex-col gap-[16px] mt-[24px] mb-[60px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-[6px]">
                <Image
                  src={BusStopPrimary}
                  alt="bus"
                  width={20}
                  height={20}
                />
                <p className="text-[#111] text-[16px]/[16px]">Lorem epsum</p>
              </div>
              <p className="text-[#111] text-[12px]/[16px]">500 m</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Map;
