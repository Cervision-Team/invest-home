import AnncTypeButton from "@/components/ui/AnncTypeButton";

const NewAnnc = ({ formik, stepErrors, isValidating, setIsValidating }) => {
  const handleButtonClick = async (type) => {
    formik.setFieldValue('newAnnouncement', type);

    if (setIsValidating) setIsValidating(true);
    try {
      await formik.validateField('newAnnouncement');
    } finally {
      if (setIsValidating) setIsValidating(false);
    }
  };

  const buttons = [
    { type: 'sell', text: 'Satıram', icon: 'selling' },
    { type: 'rentOut', text: 'Kirayə verirəm', icon: 'renting' },
    { type: 'buy', text: 'Alıram', icon: 'buying' },
    { type: 'rentIn', text: 'Kirayə axtarıram', icon: 'searching-for-rent' },
  ];

  return (
    <div className='flex flex-col justify-center gap-[30px] h-full border-b-[1px] border-[rgba(0,0,0,0.2)]'>
      <div className="flex flex-col gap-[30px]">
        <h5 className='text-[#000] text-[24px]/[28px] font-medium'>Əsas məlumat</h5>
        <h6 className='text-[#000] text-[20px]/[24px]'>Yeni elan</h6>
      </div>
      <form className='mb-[23px]'>
        <div className='grid max-[1230px]:grid-cols-1 grid-cols-[303px_303px] gap-x-[23px] gap-y-[32px]'>
          {buttons.map((btn) => (
            <AnncTypeButton
              key={btn.type}
              src={`/icons/${btn.icon}-black.svg`}
              srcOnHover={`/icons/${btn.icon}-white.svg`}
              text={btn.text}
              isActive={formik.values.newAnnouncement === btn.type}
              onClick={() => handleButtonClick(btn.type)}
            />
          ))}
        </div>

        {stepErrors.newAnnouncement && (
          <div className='text-red-500 text-sm font-medium bg-red-50 border border-red-200 rounded-[8px] px-[16px] py-[12px]'>
            {stepErrors.newAnnouncement}
          </div>
        )}
      </form>
    </div>
  );
};

export default NewAnnc;