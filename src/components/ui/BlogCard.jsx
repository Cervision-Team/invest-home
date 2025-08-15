import Image from 'next/image';
import Link from 'next/link';

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
          <div className="group w-[40px] h-[40px] flex items-center justify-center">
            <svg
              className="opacity-100 transition-all duration-200"
              width="100%"
              height="100%"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="25"
                cy="25"
                r="24.5"
                fill="white"
                stroke="black"
                className="group-hover:fill-[#FFC700] group-hover:stroke-white transition-all duration-200"
              />
              <path
                d="M15 24C14.4477 24 14 24.4477 14 25C14 25.5523 14.4477 26 15 26V24ZM35.7071 25.7071C36.0976 25.3166 36.0976 24.6834 35.7071 24.2929L29.3431 17.9289C28.9526 17.5384 28.3195 17.5384 27.9289 17.9289C27.5384 18.3195 27.5384 18.9526 27.9289 19.3431L33.5858 25L27.9289 30.6569C27.5384 31.0474 27.5384 31.6805 27.9289 32.0711C28.3195 32.4616 28.9526 32.4616 29.3431 32.0711L35.7071 25.7071ZM15 25V26H35V25V24H15V25Z"
                fill="black"
                className="group-hover:fill-white transition-all duration-200"
              />
            </svg>
          </div>
        </Link>
      </div>

      <p className="text-[#828080] text-[1rem] leading-[1.6rem] font-normal mt-[2%]">
        {description}
      </p>
    </div>
  );
};

export default BlogCard;
