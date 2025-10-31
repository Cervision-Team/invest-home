import Image from 'next/image'
import chatIcon from "../../../../../public/icons/profile/chat-icon.svg";
import notificationIcon from "../../../../../public/icons/profile/notification-icon.svg";

export const Button = () => {
  return (
    <>
      <button className="relative flex justify-center items-center bg-[#F5F5F5] rounded-[12px] w-[44px] h-[44px] cursor-pointer">
        <span className="absolute right-[4px] top-[4px] w-[10px] h-[10px] rounded-full bg-[#FF403D]"></span>
        <Image src={chatIcon} alt="chat icon" />
      </button>
      <button className="relative flex justify-center items-center bg-[#F5F5F5] rounded-[12px] w-[44px] h-[44px] cursor-pointer">
        <span className="absolute right-[4px] top-[4px] w-[10px] h-[10px] rounded-full bg-[#FF403D]"></span>
        <Image src={notificationIcon} alt="notification icon" />
      </button>
    </>
  );
};
