import Agents from "../Home/Agents";
import BeAgent from "../Home/BeAgent";
import AboutPageImage from "../../../../public/images/AboutPagePhoto.jpg";

export default function Page() {
    return (
        <>
            <section className="relative isolate min-h-[440px] pt-[62px] text-start">
                <div
                    className="absolute inset-0 bg-gray-100"
                    style={{
                        backgroundImage: `url(${AboutPageImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/5" />
                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/25 to-black/55" />

                <div className="relative max-w-[1600px] mx-auto px-20 max-[1025px]:px-5 max-[431px]:px-4">
                    <div className="min-h-[440px] py-14 max-[769px]:py-10 flex items-end">
                        <div className="max-w-[760px]">
                            <h1 className="text-white text-[44px] max-[769px]:text-[28px] italic font-semibold leading-tight">
                                Biz Kimik?
                            </h1>

                            <p className="max-w-[720px] mt-6 text-white/90 text-[22px] max-[769px]:text-[16px] font-medium leading-relaxed">
                                İnvestHome daşınmaz əmlakda etibarlı tərəfdaşınızdır. Təcrübəmiz və bazar biliklərimizlə sizə ən uyğun evi tapmağa, alqı-satqı və kirayə prosesini rahat və şəffaf şəkildə keçirməyə kömək edirik.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Agents />
            <BeAgent />
        </>
    );
}
