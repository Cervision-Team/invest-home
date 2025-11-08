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
        className="group-hover:hidden"
      />
      <Image
        src={iconOnHover}
        alt="Arrow Right White"
        className="hidden group-hover:block"
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
        className="group-hover:hidden"
      />
      <Image
        src={iconOnHover}
        alt="Arrow Left White"
        className="hidden group-hover:block"
      />
    </div>
  );
};
