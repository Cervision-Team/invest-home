import Image from 'next/image';
import ConfirmationLetter from '../../../public/icons/confirmation-letter.svg'
import Link from 'next/link';

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
  if (!isOpen) return null;


  return (
    <>
      <style>{modalStyles}</style>
      <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center animate-fadeIn"
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[3px]"></div>
        
        <div 
          className="relative bg-[#FAFAFA] rounded-[20px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] flex flex-col items-center justify-center py-[48px] animate-modalSlideIn"
          style={{ width: '414px', height: '400px' }}
        >
          <Image 
            src={ConfirmationLetter}
            alt="confirmation-letter"
            width={100}
            height={100}
          />
          <h1 className="text-[#1B1F27] text-[32px]/[36px] font-medium mt-5">Tamamlandı.</h1>
          <p className="w-[324px] text-[#1B1F27] text-center text-[16px]/[22px] font-medium mt-5">
            Təşəkkürlər! CV-niz uğurla yükləndi. Seçim nəticələri e-poçt vasitəsilə göndəriləcək.
          </p>
          <Link href="/">
            <button className="cursor-pointer flex items-center gap-[12px] text-white bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] mt-6">
              <span className="font-[500] text-[16px]">Əsas səhifəyə qayıt</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
