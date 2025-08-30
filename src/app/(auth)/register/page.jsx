"use client";

import EntryGate from "../components/EntryGate";
import RegisterForm from "../components/register/RegisterForm";



const RegisterPage = () => {

  return (
    <>
      <section className="relative h-screen">
        <div className="flex h-full">
          <div className="bg-[#02836F] w-[50%]">

          </div>
          <div className="w-[50%]">

          </div>
        </div>
        <div className="max-w-[1600px] mx-auto absolute top-0 left-[50%] translate-x-[-50%] h-full w-full flex items-center">
          <div className="w-[50%] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
            <EntryGate />
          </div>
          <div className="w-[50%] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] flex justify-center">
            <div className="w-[410px] flex flex-col gap-[36px]">
              <div className="flex flex-col gap-[24px]">
                <h1 className="text-[32px] font-medium text-center">Qeydiyyat</h1>
                <p className="text-lg text-center">
                  Yüzlərlə əmlak elanına baxmaq və öz evinizi elan etmək üçün hesab yaradın.
                </p>
              </div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
