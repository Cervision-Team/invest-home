import React from 'react'

const ProfileForm = ({ handleSubmit, onSubmit, register, isEditing, children }) => {
    const fields = [
        { label: "Ad/Soyad", name: "fullName", },
        { label: "Doğum tarixi", name: "birthDate" },
        { label: "Telefon", name: "phone" },
        { label: "Yaşayış ünvanı", name: "location" },
        { label: "Email", name: "email" },
        { label: "Vəzifəsi", name: "roleName" },
    ];
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='bg-white pt-[12px] pb-[70px] px-[20px]  shadow-[0px_4px_10px_0px_#0000001A] rounded-xl'>
                {children}
                <section className='w-[706px] border-t border-[#00000033] pt-[12px] mt-[28px] '>
                    <div className='py-[12px] grid grid-cols-2 w-full gap-x-[28px] gap-y-[20px] text-[#6C707A] '>
                        {fields.map(({ label, name }) => (
                            <div key={name} className="flex flex-col gap-[8px]">
                                <label htmlFor={name}>{label}</label>
                                <input
                                    id={name}
                                    disabled={!isEditing}
                                    {...register(name)}
                                    className="border border-[#6C707A] text-[#6C707A] text-[14px] px-[14px] py-[12px] bg-[#F8F9FC] rounded-[8px]"
                                    type="text"
                                />
                            </div>
                        ))}

                    </div>
                </section>
            </form>
        </>

    )
}

export default ProfileForm