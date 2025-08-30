import EntryGate from "../components/EntryGate";
import LoginForm from "../components/login/LoginForm";

const LoginPage = () => {

  return (
    <>
      <section className="relative h-screen">
        <div className="flex h-full">
          <div className="w-[50%]">

          </div>
          <div className="bg-[#02836F] w-[50%]">

          </div>
        </div>
        <div className="max-w-[1600px] mx-auto absolute top-0 left-[50%] translate-x-[-50%] h-full w-full flex items-center">
          <div className="w-[50%] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] flex justify-center">
            <div className="w-[410px] flex flex-col gap-[36px]">
              <div className="flex flex-col gap-[24px]">
                <h1 className="text-[32px] font-medium text-center">Daxil ol</h1>
                <p className="text-lg text-center">
                  "Invest <span className="text-[var(--color-primary)]">Home</span> – Gələcəyin evini bu gün seç, rahatlığını sabahdan
                  yaşa!"
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
          <div className="w-[50%] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
            <EntryGate />
          </div>
        </div>
      </section>

    </>
  );
};

export default LoginPage;
