import React from 'react'

const ProfileForm = ({ handleSubmit, onSubmit, register, isEditing, errors, children }) => {

    const labelClass = 'text-sm font-medium text-[#3F444D]';
    const inputClass =
        'border border-[#E1E6EF] text-[#1B1F27] placeholder:text-[#9CA3AF] text-[14px] px-3.5 py-3 bg-[#F8F9FC] rounded-lg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70';

    const fields = [
        { label: "Ad/Soyad", name: "fullName", },
        { label: "Doğum tarixi", name: "birthDate" },
        { label: "Telefon", name: "phoneNumber" },
        { label: "Yaşayış ünvanı", name: "location" },
        { label: "Email", name: "email" },
    ];
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='bg-white px-4 py-5 sm:px-6 sm:py-6 shadow-[0px_4px_18px_0px_rgba(0,0,0,0.08)] rounded-2xl border border-black/5'>
                {children}

                <section className='w-full border-t border-black/10 pt-6 mt-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-x-10 gap-y-6'>
                        {fields.map(({ label, name }) => (
                            <div key={name} className="flex flex-col gap-2">
                                <label className={labelClass} htmlFor={name}>{label}</label>
                                                                {name === 'phoneNumber' ? (
                                                                    <>
                                                                        <div
                                                                            className={
                                                                                'flex w-full overflow-hidden rounded-lg border bg-[#F8F9FC] outline-none transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ' +
                                                                                (errors?.phoneLocalNumber ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15' : 'border-[#E1E6EF]')
                                                                            }
                                                                        >
                                                                            <div className='relative shrink-0'>
                                                                                <select
                                                                                    aria-label='Ölkə kodu'
                                                                                    disabled={!isEditing}
                                                                                    defaultValue='+994'
                                                                                    {...register('phoneCountryCode')}
                                                                                    className='appearance-none bg-transparent text-[#1B1F27] text-[14px] pl-3.5 pr-9 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-70'
                                                                                >
                                                                                    <option value='+994'>+994</option>
                                                                                </select>
                                                                                <svg
                                                                                    aria-hidden='true'
                                                                                    viewBox='0 0 20 20'
                                                                                    className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C707A]'
                                                                                >
                                                                                    <path
                                                                                        fill='currentColor'
                                                                                        d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z'
                                                                                    />
                                                                                </svg>
                                                                            </div>

                                                                            <div className='my-2 w-px bg-[#E1E6EF]' />

                                                                            <input
                                                                                id={name}
                                                                                disabled={!isEditing}
                                                                                inputMode='numeric'
                                                                                placeholder='50 123 45 67'
                                                                                {...register('phoneLocalNumber', {
                                                                                    validate: (value) => {
                                                                                        const digits = String(value || '').replace(/\D/g, '');
                                                                                        if (!digits) return true;
                                                                                        if (digits.length !== 9) return 'Telefon nömrəsi 9 rəqəm olmalıdır';
                                                                                        return true;
                                                                                    },
                                                                                })}
                                                                                className='min-w-0 flex-1 bg-transparent text-[#1B1F27] placeholder:text-[#9CA3AF] text-[14px] px-3.5 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-70'
                                                                                type='tel'
                                                                            />
                                                                        </div>
                                                                        {errors?.phoneLocalNumber?.message && (
                                                                            <p className='text-xs text-red-600'>
                                                                                {String(errors.phoneLocalNumber.message)}
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <input
                                                                            id={name}
                                                                            disabled={!isEditing||name==="email"}
                                                                            {...(name === "birthDate"
                                                                                    ? register(name, {
                                                                                            validate: (value) =>
                                                                                                    !value || /^\d{4}-\d{2}-\d{2}$/.test(value) || "YYYY-MM-DD formatında olmalıdır",
                                                                                    })
                                                                                    : register(name))}
                                                                            className={inputClass}
                                                                            type={name === "birthDate" ? "date" : "text"}
                                                                            lang={name === "birthDate" ? "en-CA" : undefined}
                                                                    />
                                                                )}
                            </div>
                        ))}
                        
                    </div>
                </section>
            </form>
        </>

    )
}

export default ProfileForm
