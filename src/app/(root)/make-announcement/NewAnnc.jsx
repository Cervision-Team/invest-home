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
    { type: 'buy', text: 'Alıram', icon: 'buying' },
    { type: 'rentOut', text: 'Kirayə verirəm', icon: 'renting' },
    { type: 'rentIn', text: 'Kirayə axtarıram', icon: 'searching-for-rent' },
  ];

  return (
    <div className='h-full flex items-center justify-center gap-[95px] pb-[16px] border-b-[1px] border-[rgba(0,0,0,0.2)]'>
      <form className='flex flex-col items-start gap-[30px]'>
        <h5 className='text-[#000] text-[24px]/[28px] font-medium'>Əsas məlumat</h5>
        <h6 className='text-[#000] text-[20px]/[24px]'>Yeni elan</h6>

        <div className='flex flex-col gap-[16px]'>
          <div className='flex flex-row flex-wrap gap-x-[23px] gap-y-[32px]'>
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
        </div>
      </form>
    </div>
  );
};

export default NewAnnc;