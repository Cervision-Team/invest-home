import React from 'react'

const ProfileForm = ({ handleSubmit, onSubmit, register, isEditing, isSubmitting = false, errors, children }) => {

    const formDisabled = !isEditing || isSubmitting;

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
    const textareaClass =
        'min-h-[110px] resize-y border border-[#E1E6EF] text-[#1B1F27] placeholder:text-[#9CA3AF] text-[14px] px-3.5 py-3 bg-[#F8F9FC] rounded-lg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70';

    const socialIconWrap =
        'absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-white border border-black/5 flex items-center justify-center text-[#02836F]';

    const socialInputClass =
        'border border-[#E1E6EF] text-[#1B1F27] placeholder:text-[#9CA3AF] text-[14px] pl-[52px] pr-3.5 py-3 bg-[#F8F9FC] rounded-lg outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70';

    return (
        <>
            <form aria-busy={isSubmitting} onSubmit={handleSubmit(onSubmit)} className='bg-white px-4 py-5 sm:px-6 sm:py-6 shadow-[0px_4px_18px_0px_rgba(0,0,0,0.08)] rounded-2xl border border-black/5'>
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
                                                    disabled={formDisabled}
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
                                                disabled={formDisabled}
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
                                        disabled={formDisabled || name === "email"}
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

                <section className='w-full border-t border-black/10 pt-6 mt-6'>
                    <div className='flex items-center justify-between gap-3 mb-4'>
                        <h3 className='text-[16px] font-semibold text-[#1B1F27]'>Əlavə məlumatlar</h3>
                        <span className='text-[12px] text-black/50'>İstəyə görə</span>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label className={labelClass} htmlFor='aboutMe'>About me</label>
                            <textarea
                                id='aboutMe'
                                disabled={formDisabled}
                                placeholder='Qısa bio yazın… (məs: 5 illik təcrübə, fokus sahəniz və s.)'
                                {...register('aboutMe', {
                                    setValueAs: (v) => (typeof v === 'string' ? v : ''),
                                })}
                                className={textareaClass}
                            />
                            {errors?.aboutMe?.message ? (
                                <p className='text-xs text-red-600'>{String(errors.aboutMe.message)}</p>
                            ) : (
                                <p className='text-[12px] text-black/50'>Bu məlumat profilinizdə görünə bilər.</p>
                            )}
                        </div>

                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-2'>
                                <label className={labelClass} htmlFor='whatsapp'>WhatsApp</label>
                                <div className='relative'>
                                    <div className={socialIconWrap} aria-hidden='true'>
                                        <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                                            <path d='M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.91.55 3.78 1.59 5.39L2 22l4.83-1.66a9.87 9.87 0 0 0 5.21 1.5h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.73 14.02c-.24.67-1.39 1.28-1.92 1.36-.5.08-1.13.12-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.26-4.79-4.18-4.93-4.38-.14-.2-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36.2 0 .39 0 .56.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.11.33.02.53-.09.2-.13.33-.26.5-.13.17-.27.38-.39.51-.13.13-.26.27-.11.53.15.26.67 1.1 1.44 1.79.99.88 1.82 1.16 2.08 1.29.26.13.41.11.56-.07.15-.18.64-.75.81-1.01.17-.26.33-.22.56-.13.24.09 1.5.71 1.76.84.26.13.44.2.5.31.06.11.06.65-.18 1.32Z' />
                                        </svg>
                                    </div>
                                    <input
                                        id='whatsapp'
                                        disabled={formDisabled}
                                        placeholder='+994501234567 və ya https://wa.me/994501234567'
                                        {...register('whatsapp', {
                                            validate: (value) => {
                                                const v = String(value || '').trim();
                                                if (!v) return true;
                                                if (/^https?:\/\//i.test(v)) return true;
                                                if (/^\+?\d{7,15}$/.test(v.replace(/[\s()-]/g, ''))) return true;
                                                return 'WhatsApp link və ya nömrə düzgün deyil';
                                            },
                                        })}
                                        className={socialInputClass}
                                        type='text'
                                    />
                                </div>
                                {errors?.whatsapp?.message ? (
                                    <p className='text-xs text-red-600'>{String(errors.whatsapp.message)}</p>
                                ) : null}
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <label className={labelClass} htmlFor='instagram'>Instagram</label>
                                    <div className='relative'>
                                        <div className={socialIconWrap} aria-hidden='true'>
                                            <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                                                <path d='M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm8.4 2H7.8A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6.4-2.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z' />
                                            </svg>
                                        </div>
                                        <input
                                            id='instagram'
                                            disabled={formDisabled}
                                            placeholder='https://instagram.com/username'
                                            {...register('instagram', {
                                                validate: (value) => {
                                                    const v = String(value || '').trim();
                                                    if (!v) return true;
                                                    if (/^https?:\/\//i.test(v)) return true;
                                                    if (/^@?[a-zA-Z0-9._]{2,30}$/.test(v)) return true;
                                                    return 'Instagram link və ya username düzgün deyil';
                                                },
                                            })}
                                            className={socialInputClass}
                                            type='text'
                                        />
                                    </div>
                                    {errors?.instagram?.message ? (
                                        <p className='text-xs text-red-600'>{String(errors.instagram.message)}</p>
                                    ) : null}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className={labelClass} htmlFor='linkedin'>LinkedIn</label>
                                    <div className='relative'>
                                        <div className={socialIconWrap} aria-hidden='true'>
                                            <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                                                <path d='M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3.5 21V9h3v12h-3Zm7 0V9h2.9v1.64h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V21h-3v-5.7c0-1.36-.02-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3V21h-3Z' />
                                            </svg>
                                        </div>
                                        <input
                                            id='linkedin'
                                            disabled={formDisabled}
                                            placeholder='https://linkedin.com/in/username'
                                            {...register('linkedin', {
                                                validate: (value) => {
                                                    const v = String(value || '').trim();
                                                    if (!v) return true;
                                                    if (/^https?:\/\//i.test(v)) return true;
                                                    return 'LinkedIn link düzgün deyil';
                                                },
                                            })}
                                            className={socialInputClass}
                                            type='text'
                                        />
                                    </div>
                                    {errors?.linkedin?.message ? (
                                        <p className='text-xs text-red-600'>{String(errors.linkedin.message)}</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </>

    )
}

export default ProfileForm
