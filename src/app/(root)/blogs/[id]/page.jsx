
import { blogData } from '@/components/core/BlogsData';
import Image from 'next/image';
// import markdownit from "markdown-it"
import WhiteStar from "../../../../../public/icons/whiteStar.svg"
import YellowStar from "../../../../../public/icons/yellowStar.svg"
import RatingStars from '@/components/ui/RatingStars';
import RoundedBlackButton from '@/components/ui/RoundedBlackButton';
import InstagramIcon from "../../../../../public/icons/Instagram.svg"
import { FaWhatsapp } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";



const Page = ({ params }) => {

// const md = new markdownit();
  const { id } = params;

  const blog = blogData.find((item) => item.id.toString() === id);

  if (!blog) {
    return (
      <div className="text-center mt-10 text-red-600">
        Blog not found.
      </div>
    );
  }

//   const parsedContent = md.render(blog.description);

  return (
    <div className='max-w-[1600px] mx-auto w-auto h-auto flex flex-col justify-center px-[80px] mt-[46px]'>
        <div className=' flex flex-col flex-wrap justify-center items-center'>

      <div className='max-w-[768px] w-auto h-auto flex flex-col flex-wrap justify-center items-center'>
        <h1 className='text-[#1B1F27] text-center text-[32px] font-medium'>
          {blog.title} - {blog.description}
        </h1>
      </div>
        </div>
        

      <div className='w-full h-[500px] relative mt-[68px]'>
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className='rounded-[12px] object-cover'
        />
      </div>

        {/* {parsedContent ? (
           <article 
           className='prose max-w-4xl font-work-sans break-all'
           dangerouslySetInnerHTML={{__html: parsedContent}}
           />
       ) : (
           <p className='no-result'>
             No details provided
           </p>
       )} */}
      <div className=' flex flex-row items-start mt-[40px] gap-[14px]'>
        <div className='w-[5px] h-[120px] bg-primary'></div>
        <p className='w-[500px] text-black text-[24px]/[38px] font-medium '>Ev almaq yalnız bir daş divar deyil — bu, həm də həyat tərzi seçimi, uzunmüddətli sərmayə və emosional bir qərardır. </p>
      </div>

      <div className='w-full h-auto flex flex-col gap-[34px] mt-[18px]'>
        <p className='text-black text-[20px]/[32px] '>Bir çox insan bu prosesi ya tələsik qərarlarla, ya da kifayət qədər məlumat olmadan etdiyindən, sonradan peşmançılıq yaşayir.
Bu yazıda ev alarkən ən çox diqqətdən yayınan məqamları sənə peşəkar dildə və aydın şəkildə izah edəcəyik.</p>

        <div className='flex flex-col'>
          <p className='text-black text-[24px]/[39px] font-medium'>1. Büdcəni dəqiq müəyyənləşdir</p>
          <p className='text-[#100F0F] text-[20px]/[32px] '>
          Ev almağa başlamazdan əvvəl real büdcəni bilməlisən. Bura yalnız evin qiyməti deyil, əlavə xərclər də daxildir: 
          notariat, dövlət rüsumları, təmir, daşınma və s. <br />Tövsiyə: Əlavə xərclər üçün ümumi məbləğin ən azı 10-15%-ni ayır.
          </p>
        </div>

        <div className='flex flex-col'>
          <p className='text-black text-[24px]/[39px] font-medium'>2. Sənədləşmə vəziyyətini araşdırır</p>
          <p className='text-[#100F0F] text-[20px]/[32px] '>
          Ev sənədləri qaydasında deyilsə, gələcəkdə hüquqi problemlərlə qarşılaşa bilərsən. Çıxarış (kupça), texniki pasport, 
          ipoteka yükü olub-olmaması – bunlar vacibdir.
          <br />
          Tövsiyə: Notarius və ya əmlak hüququ üzrə mütəxəssislə sənədləri yoxlat.
          </p>
        </div>

        <div className='flex flex-col'>
          <p className='text-black text-[24px]/[39px] font-medium'>3. Yerləşmə və infrastruktur</p>
          <p className='text-[#100F0F] text-[20px]/[32px] '>Ev gözəl olsa belə, əgər məktəb, bağça, market, ictimai nəqliyyat uzaqdadırsa, gündəlik həyat çətinləşəcək.
          <br />
          Tövsiyə: Xəritədə ərazini yoxla və pik saatlarda əraziyə get.</p>
        </div>

        <div className='flex flex-col'>
          <p className='text-black text-[24px]/[39px] font-medium'>4. Binanın və mənzilin vəziyyəti</p>
          <p className='text-[#100F0F] text-[20px]/[32px] '>
          Əgər yeni tikiliyə baxırsansa, tikinti şirkətinin etibarlılığı araşdırılmalıdır. Köhnə tikilidirsə, binanın istismar 
          durumu, lift, dam örtüyü, su sistemi kimi məsələlərə diqqət yetir.
          <br />
          Tövsiyə: Ərazidə yaşayanlarla danış – real fikir öyrənmək üçün bu çox dəyərlidir.
          <br />
          gözlənilirmi? Yeni metro, məktəb, ticarət mərkəzi tikilir?Bu blogda qeyd etdiyimiz məqamlar – büdcənin düzgün 
          müəyyənləşdirilməsi, hüquqi sənədlərin yoxlanması, yerləşmənin və əmlakın fiziki vəziyyətinin qiymətləndirilməsi,
           real bazar qiymətləri ilə müqayisə aparılması və gələcək perspektivin dəyərləndirilməsi – hamısı sənin daha strateji, 
           rasional və təhlükəsiz qərar verməyin üçündür.Evi yalnız "gözəl görünüşünə" və ya "hazır fürsət" olduğuna görə alma – hər 
           fürsət, əslində, doğru fürsət olmaya bilər. Yaxşı bir ev, sənə təkcə yaşamaq üçün yer vermir; sənə hüzur, sabitlik,
            güvən və investisiya potensialı təqdim edir.Əgər hələ də hansısa mərhələdə tərəddüddəsənsə, peşəkar dəstək almaqdan çəkinmə. 
            Doğru vasitəçilər, hüquqşünaslar və əmlak məsləhətçiləri ilə işləmək səni həm stressdən, həm də mümkün risklərdən qoruyacaq.
          </p>
        </div>
      </div>

      <div className='flex flex-col items-end mt-[80px]'>
        <div className='flex flex-col items-start gap-[28px]'>

        <div className='flex flex-row items-start gap-[28px]'>
        <p className='text-black text-[20px]/[30px]'>Məqalani qiymətləndirin</p>
            <RatingStars />
        </div>

        <div className='flex flex-row items-center gap-[28px]'>
        <p className='text-black text-[20px]/[30px]'>Məqalani paylaşın</p>

        <div className='flex flex-row items-center gap-[12px]'>
          <RoundedBlackButton
            icon={
              <FaWhatsapp />
            }
            backgroundColor="#28E55F" />
          <RoundedBlackButton
            icon={
                <Image src={InstagramIcon} alt="Instagram" width={18} height={18} />
            }
            backgroundColor="linear-gradient(to right, #8a3ab9, #e95950, #fccc63)" />
          <RoundedBlackButton
            icon={
                <FaLinkedinIn />
            }
            backgroundColor="#0073AF" />

        </div>
        </div>
            </div>
      </div>
    </div>
  );
};

export default Page;
