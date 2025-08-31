import Image from 'next/image';
import Link from 'next/link';
import { ButtonWithArrowRight } from './ButtonWithArrow';
import arrowRightBlack from "../../../public/icons/arrow-right-black.svg"
import arrowRightWhite from "../../../public/icons/arrow-right-white.svg"

export const BlogCard = ({ id, image, title, description, day, month, titleColor }) => {
  return (
    <div className="w-full max-sm:w-full max-[1265px]:w-[48%] min-[1265px]:w-[31%] h-auto flex flex-col relative">
      <div className="h-[240px] rounded-[30px] relative overflow-hidden w-full">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-[30px]"
        />
        <div className="absolute inset-0 bg-black opacity-30 rounded-[30px]"></div>
      </div>

      <div className=" h-[50px] w-[50px] rounded-[0px_0px_10px_10px] flex flex-col justify-center items-center bg-white shadow-[4px_4px_15px_0px_rgba(0,0,0,0.25)] absolute left-[50px] gap-[6px]"> 
        <h4 className="h-5 text-2 text-[19.4px] font-medium">{day}</h4> 
        <p className="text-3 text-[16px] leading-tight font-normal"> {month} </p> 
        </div>  
  
      <div className="flex items-center mt-[4%] gap-3">
        <h3
          className="text-[1.6rem] font-medium"
          style={{ color: titleColor || 'white' }}
        >
          {title}
        </h3>
        <Link href={`/blogs/${id}`}>
        <ButtonWithArrowRight 
        bgColor="white"
        bgColorOnHover="#FFC700"
        borderColor="#000"
        borderColorOnHover="#FAFAFA"
        icon={arrowRightBlack}
        iconOnHover={arrowRightWhite}
        />
        </Link>
      </div>

      <p className="text-[#828080] text-[1rem] leading-[1.6rem] font-normal mt-[2%]">
        {description}
      </p>
    </div>
  );
};

export default BlogCard;
