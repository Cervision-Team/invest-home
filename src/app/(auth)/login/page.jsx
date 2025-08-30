import Link from "next/link";
import EntryGate from "../components/EntryGate";
import LoginForm from "../components/login/LoginForm";
import Image from "next/image";
import X_Icon from "../../../../public/icons/x.svg"

const LoginPage = () => {

  return (
    <>
      <section className="relative h-screen">
        <div className="max-[1025px]:hidden flex min-h-full">
          <div className="w-[50%]">

          </div>
          <div className="bg-[#02836F] w-[50%]">

          </div>

        </div>
        <div className="max-w-[1600px] mx-auto absolute top-0 left-[50%] translate-x-[-50%] min-h-full w-full flex min-[1024px]:items-center">
          <div className="flex min-w-0 w-full">
            <div className="max-[1025px]:w-full w-[50%] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] flex justify-center">
              <div className="py-[20px] max-[1025px]:w-[600px] w-[410px] flex flex-col gap-[36px]">
                <div className="min-[1024px]:hidden flex justify-between items-center">
                  <div className="flex gap-[7px] items-center font-[600] text-[18px]">
                    <Image
                      src={"/images/logo.png"}
                      alt="Invest Home Logo"
                      width={50}
                      height={50}
                      priority
                      className="flex-shrink-0"
                    />
                    <span>Invest Home</span>
                  </div>
                  <Link href={"/"}>
                    <div className="w-[24px] h-[24px] flex items-center justify-center">
                      <Image
                        src={X_Icon}
                        width={13}
                        height={13}
                        alt='x_icon'
                      />
                    </div>
                  </Link>
                </div>
                <div className="flex flex-col gap-[24px]">
                  <h1 className="text-[32px] font-medium text-center">Daxil ol</h1>
                  <p className="text-lg text-center">
                    "Invest <span className="text-[var(--color-primary)]">Home</span> – Gələcəyin evini bu gün seç, rahatlığını sabahdan
                    yaşa!"
                  </p>
                </div>
                <LoginForm />
                <div className="min-[1025px]:hidden w-full flex flex-col items-center gap-[24px]">
                  <span>Hesabınız yoxdur? <Link className="text-primary" href={"/register"}>Qeydiyyatdan keçin</Link>.</span>
                </div>
              </div>
            </div>
            <div className="py-[20px] max-[1025px]:hidden w-[50%] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
              <EntryGate />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;