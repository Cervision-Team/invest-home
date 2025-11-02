import Image from "next/image";
// import { useTranslation } from "i18next";

const Neighborhoods = () => {
  // const {t} = useTranslation()
  return (
    <>
      <>
        <section className="mt-[48px] max-w-[1600px] mx-auto">
          <div className="max-w-full w-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
            {/* Changed background color to transparent and adjusted padding for better responsiveness */}
            <div className="flex flex-col gap-[60px] bg-transparent max-[769px]:pb-[5rem]">
              <div className="text-center flex flex-col gap-[10px] ">
                <h4 className="text-[var(--primary-color)] text-[1.5rem] font-400">
                  {/* {t("Şəhərə böyük sahələr")} */}
                  Şəhərdə aktiv sahələr
                </h4>
                <h2 className="text-var[var(--text-color-2)] font-600 text-[1.9rem] max-[769px]:text-[1.5rem]">
                  {/* {t("Qonşuluq Əmlakları")} */}
                  Qonşuluq Əmlakları
                </h2>
              </div>
              <div className="select-none max-[769px]:max-h-none max-h-[660px] grid grid-rows-2 grid-cols-12 max-[431px]:gap-[16px] gap-[20px]">
                <div className="max-[431px]:col-span-12 max-[769px]:col-span-5 max-[769px]:h-[150px] max-[431px]:h-[90px] col-span-4 group relative max-[769px]:rounded-[9px] rounded-[30px] overflow-hidden shadow-[4px_10px_30px_0_rgba(0,0,0,0.06)] text-white transition-all duration-400 ease-in">
                  <Image
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    width={411}
                    height={300}
                    src="/images/mardakan.jpg"
                    alt="Mardakan Invest Home"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]"></div>
                  <div className="w-full absolute bottom-0 left-0 font-[500]">
                    <div className="p-4 max-[431px]:p-0 max-[431px]:px-3 max-[431px]:flex flex-row-reverse justify-between items-center">
                      <h1 className="opacity-60 group-hover:opacity-90 group-hover:text-[var(--yellow)] text-[58px] max-[769px]:text-[30px]">
                        216
                      </h1>
                      <p className="opacity-60 group-hover:opacity-90 group-hover:text-white text-[20px] max-[769px]:text-[16px]">
                        Mardakan, Baku
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-[431px]:col-span-12 max-[769px]:col-span-7 max-[769px]:h-[150px] max-[431px]:h-[90px] col-span-4 group relative max-[769px]:rounded-[9px] rounded-[30px] overflow-hidden shadow-[4px_10px_30px_0_rgba(0,0,0,0.06)] text-white transition-all duration-400 ease-in">
                  <Image
                    className="w-full h-full object-cover scale-125 group-hover:scale-135 transition-transform duration-300 ease-in-out"
                    fill
                    src="/images/melissa.jpg"
                    alt="Melissa Invest Home"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]"></div>
                  <div className="w-full absolute bottom-0 left-0 font-[500]">
                    <div className="p-4 max-[431px]:p-0 max-[431px]:px-3 max-[431px]:flex flex-row-reverse justify-between items-center">
                      <h4 className="opacity-60 group-hover:opacity-90 group-hover:text-[var(--yellow)] text-[58px] max-[769px]:text-[30px]">
                        141
                      </h4>
                      <p className="opacity-60 group-hover:opacity-90 group-hover:text-white text-[20px] max-[769px]:text-[16px]">
                        Melissa Park
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-[431px]:col-span-12 max-[769px]:col-span-7 max-[769px]:h-[150px] max-[431px]:h-[90px] col-span-4 group relative max-[769px]:rounded-[9px] rounded-[30px] overflow-hidden shadow-[4px_10px_30px_0_rgba(0,0,0,0.06)] text-white transition-all duration-400 ease-in">
                  <Image
                    className="w-full h-full object-cover scale-125 group-hover:scale-135 transition-transform duration-300 ease-in-out"
                    width={413}
                    height={300}
                    src="/images/buzovna.jpg"
                    alt="Buzovna Invest Home"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]"></div>
                  <div className="w-full absolute bottom-0 left-0 font-[500]">
                    <div className="p-4 max-[431px]:p-0 max-[431px]:px-3 max-[431px]:flex flex-row-reverse justify-between items-center">
                      <h4 className="opacity-60 group-hover:opacity-90 group-hover:text-[var(--yellow)] text-[58px] max-[769px]:text-[30px]">
                        212
                      </h4>
                      <p className="opacity-60 group-hover:opacity-90 group-hover:text-white text-[20px] max-[769px]:text-[16px]">
                        Buzovna, Baku
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-[431px]:col-span-12 max-[769px]:col-span-5 max-[769px]:h-[150px] max-[431px]:h-[90px] col-span-5 group relative max-[769px]:rounded-[9px] rounded-[30px] overflow-hidden shadow-[4px_10px_30px_0_rgba(0,0,0,0.06)] text-white transition-all duration-400 ease-in">
                  <Image
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    width={521}
                    height={300}
                    src="/images/masazir.jpg"
                    alt="Masazir Invest Home"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]"></div>
                  <div className="absolute bottom-0 left-0 w-full font-[500]">
                    <div className="p-4 max-[431px]:p-0 max-[431px]:px-3 max-[431px]:flex flex-row-reverse justify-between items-center">
                      <h4 className="opacity-60 group-hover:opacity-90 group-hover:text-[var(--yellow)] text-[58px] max-[769px]:text-[30px]">
                        183
                      </h4>
                      <p className="opacity-60 group-hover:opacity-90 group-hover:text-white text-[20px] max-[769px]:text-[16px]">
                        Masazır, Baku
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-[431px]:col-span-12 max-[769px]:col-span-12 max-[769px]:h-[150px] max-[431px]:h-[90px] col-span-7 group relative max-[769px]:rounded-[9px] rounded-[30px] overflow-hidden shadow-[4px_10px_30px_0_rgba(0,0,0,0.06)] text-white transition-all duration-400 ease-in">
                  <Image
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    width={738}
                    height={300}
                    src="/images/seabreeze.jpg"
                    alt="Seabreeze Invest Home"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]"></div>
                  <div className="w-full absolute bottom-0 left-0 font-[500]">
                    <div className="p-4 max-[431px]:p-0 max-[431px]:px-3 max-[431px]:flex flex-row-reverse justify-between items-center">
                      <h4 className="opacity-60 group-hover:opacity-90 group-hover:text-[var(--yellow)] text-[58px] max-[769px]:text-[30px]">
                        112
                      </h4>
                      <p className="opacity-60 group-hover:opacity-90 group-hover:text-white text-[20px] max-[769px]:text-[16px]">
                        Sea Breeze
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
};

export default Neighborhoods;
