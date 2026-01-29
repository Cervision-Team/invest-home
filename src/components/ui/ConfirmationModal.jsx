"use client"

import Image from 'next/image';
import ConfirmationLetter from '../../../public/icons/confirmation-letter.svg'
import Link from 'next/link';
import { useEffect } from 'react';

const modalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }

  .animate-modalSlideIn {
    animation: modalSlideIn 0.3s ease-out forwards;
  }
`;

const ConfirmationModal = ({ isOpen,setIsOpen=() => {}, text, buttonText = "Əsas səhifəyə qayıt", url = "/" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{modalStyles}</style>

      <div className="fixed inset-0 h-screen w-full bg-black/40 backdrop-blur-[3px] z-9999"></div>

      <div className="fixed inset-0 z-10000 flex items-center justify-center animate-fadeIn">

        <div className='px-4 flex min-w-0'>
          <div
            className="w-[414px] min-w-0 h-[400px] bg-[#FAFAFA] rounded-[20px] flex flex-col items-center justify-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-12 animate-modalSlideIn"
          >
            <Image
              src={ConfirmationLetter}
              alt="confirmation-letter"
              width={100}
              height={100}
            />
            <h1 className="text-[#1B1F27] text-[32px]/[36px] max-[430px]:text-[20px] font-medium mt-5">Tamamlandı.</h1>
            <p className="max-w-[324px] text-[#1B1F27] text-center text-[16px]/[22px] font-medium mt-5">
              {text}
            </p>
            <Link href={url} onClick={() => setIsOpen(false)}>
              <button className="cursor-pointer flex items-center gap-3 text-white bg-(--primary-color) rounded-lg py-3 px-[34px] mt-6">
                <span className="font-medium text-[16px]">{buttonText}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
