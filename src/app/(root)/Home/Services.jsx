'use client';

import Image from "next/image";

function Services() {
    return (
        <section id="service" className="mt-20 max-[431px]:mt-[0px] max-w-[1600px] mx-auto font-primary bg-text-6 px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
            <div className="flex flex-col items-center text-center gap-6 mb-10 max-[431px]:mb-[50px]">
                <h3 className="text-primary text-center text-[48px]/[44px] leading-[28px] font-[400]">
                    Xidmətlərimiz
                </h3>
                <h2 className="max-[431px]:text-[20px] max-[431px]:leading-[23px] text-[#0B090A] font-[500] text-[34px] leading-[46px] max-w-2xl">
                    İnvest Home ilə əmlakı asanlıqla tapın.
                </h2>
            </div>

            <div className="grid grid-cols-3 max-[769px]:grid-cols-1 grid-rows-1 gap-x-[21px] gap-y-[16px]">
                <ServiceCard title="Satılıq" image="/icons/services-sale.svg"/>
                <ServiceCard title="Kirayə" image="/icons/services-rent.svg" width="58" height="58" />
                <ServiceCard title="Günlük" image="/icons/services-daily.svg" />
            </div>
        </section>
    );
}

function ServiceCard({ title, image, width="48", height="48" }) {
    return (
        <>
            <div className="border-2 border-solid  border-[#80C1B7] rounded-[30px] p-[20px] pl-[48px] pb-[61px] max-[1025px]:p-[20px] max-[769px]:p-[16px] flex flex-col max-[769px]:flex-row max-[769px]:items-center gap-[26px] shadow-[4px_10px_30px_0_rgba(0,0,0,0.03)]">
                <div className="w-full flex flex-col gap-[26px] max-[769px]:gap-[10px] max-[431px]:gap-[0px]">
                    <div className="flex w-full justify-between items-center">
                        <h6 className="text-[32px] max-[769px]:text-[24px] font-[500] max-[1090px]:text-[28px]">{title}</h6>
                        <div className="shrink-0 max-[769px]:hidden shadow-[4px_10px_30px_0px_rgba(67,_97,_238,_0.2)] icon w-[90px] h-[90px] flex items-center justify-center rounded-full bg-[#02836F80]">
                            <Image src={image} alt="House Icon" width={width} height={height} />
                        </div>
                    </div>
                    <div>
                        <p className="max-[431px]:line-clamp-2 text-3 text-[16px] max-[769px]:text-[12px] w-[252px] max-[1090px]:w-full max-[1090px]:text-[14px] max-[1090px]:leading-[22px]">
                            Donec porttitor euismod dignissim. Nullam a lacinia ipsum, nec dignissim purus.
                        </p>
                    </div>
                </div>
                <div className="hidden max-[769px]:flex shrink-0 shadow-[4px_10px_30px_0px_rgba(67,_97,_238,_0.2)] icon w-[90px] h-[90px] max-[769px]:w-[60px] max-[769px]:h-[60px] items-center justify-center rounded-full bg-[#02836F80]">
                    <i className="text-[white] fa-solid fa-bed text-[40px] max-[769px]:text-[24px]"></i>
                </div>
            </div>
        </>
    );
}

export default Services;
