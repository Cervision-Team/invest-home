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

const ConfirmationModal = ({ isOpen }) => {
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

      <div class="fixed inset-0 h-[100vh] w-full bg-black/40 backdrop-blur-[3px] z-999"></div>

      <div className="fixed inset-0 z-[1000] flex items-center justify-center animate-fadeIn">

        <div className='px-[16px] flex min-w-0'>
          <div
            className="w-[414px] min-w-0 h-[400px] bg-[#FAFAFA] rounded-[20px] flex flex-col items-center justify-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-[48px] animate-modalSlideIn"
          >
            <Image
              src={ConfirmationLetter}
              alt="confirmation-letter"
              width={100}
              height={100}
            />
            <h1 className="text-[#1B1F27] text-[32px]/[36px] max-[430px]:text-[20px] font-medium mt-5">Tamamlandı.</h1>
            <p className="max-w-[324px] text-[#1B1F27] text-center text-[16px]/[22px] font-medium mt-5">
              Təşəkkürlər! CV-niz uğurla yükləndi. Seçim nəticələri e-poçt vasitəsilə göndəriləcək.
            </p>
            <Link href="/">
              <button className="cursor-pointer flex items-center gap-[12px] text-white bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] mt-6">
                <span className="font-[500] text-[16px]">Əsas səhifəyə qayıt</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
