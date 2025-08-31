import Image from "next/image";

export const ButtonWithArrowRight = ({ 
  borderColor, 
  bgColor, 
  icon, 
  iconOnHover, 
  borderColorOnHover, 
  bgColorOnHover 
}) => {
  return (
    <div
      className={`cursor-pointer group relative w-[50px] h-[50px] flex items-center justify-center rounded-full border-[0.5px] border-solid transition-all duration-200`}
      style={{
        borderColor: borderColor,
        backgroundColor: bgColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderColorOnHover;
        e.currentTarget.style.backgroundColor = bgColorOnHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.backgroundColor = bgColor;
      }}
    >
      <Image
        src={icon}
        alt="Arrow Right"
        className="arrow-anim-right group-hover:hidden"
      />
      <Image
        src={iconOnHover}
        alt="Arrow Right White"
        className="arrow-anim-right hidden group-hover:block"
      />
    </div>
  );
};

export const ButtonWithArrowLeft = ({ 
  borderColor, 
  bgColor, 
  icon, 
  iconOnHover, 
  borderColorOnHover, 
  bgColorOnHover 
}) => {
  return (
    <div
      className={`cursor-pointer group relative w-[50px] h-[50px] flex items-center justify-center rounded-full border-[0.5px] border-solid transition-all duration-200`}
      style={{
        borderColor: borderColor,
        backgroundColor: bgColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderColorOnHover;
        e.currentTarget.style.backgroundColor = bgColorOnHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.backgroundColor = bgColor;
      }}
    >
      <Image
        src={icon}
        alt="Arrow Left"
        className="arrow-anim-left group-hover:hidden"
      />
      <Image
        src={iconOnHover}
        alt="Arrow Left White"
        className="arrow-anim-left hidden group-hover:block"
      />
    </div>
  );
};

