"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(-12px);
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
    animation: modalSlideIn 0.24s ease-out forwards;
  }
`;

export default function MessageModal({
  isOpen,
  onClose = () => {},
  variant = "success",
  title,
  message,
  primaryText = "Bağla",
  onPrimary,
  secondaryText,
  onSecondary,
}) {
  useEffect(() => {
    if (isOpen) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  if (!isOpen) return null;

  const isError = variant === "error";
  const Icon = isError ? XCircle : CheckCircle2;
  const iconColor = isError ? "text-red-500" : "text-primary";
  const defaultTitle = isError ? "Xəta" : "Uğurlu";

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else onClose();
  };

  return (
    <>
      <style>{modalStyles}</style>

      <div
        className="fixed inset-0 h-screen w-full bg-black/40 backdrop-blur-[3px] z-999"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-1000 flex items-center justify-center animate-fadeIn">
        <div className="px-4 flex min-w-0">
          <div className="w-[414px] min-w-0 bg-[#FAFAFA] rounded-[20px] flex flex-col items-center justify-center shadow-[0_4px_24px_0_rgba(0,0,0,0.18)] py-10 px-6 animate-modalSlideIn">
            <Icon className={`${iconColor}`} size={64} />
            <h2 className="text-[#1B1F27] text-[28px]/[32px] max-[430px]:text-[20px] font-medium mt-5 text-center">
              {title || defaultTitle}
            </h2>
            {message ? (
              <p className="max-w-[340px] text-[#1B1F27] text-center text-[16px]/[22px] font-medium mt-4">
                {message}
              </p>
            ) : null}

            <div className="mt-7 w-full flex gap-3">
              {secondaryText ? (
                <button
                  type="button"
                  onClick={onSecondary || onClose}
                  className="cursor-pointer w-full border border-black/15 rounded-lg py-3 px-4 text-[#1B1F27] hover:bg-black/5"
                >
                  <span className="font-medium text-[16px]">{secondaryText}</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={handlePrimary}
                className="cursor-pointer w-full flex items-center justify-center gap-3 text-white bg-(--primary-color) rounded-lg py-3 px-4 hover:opacity-90"
              >
                <span className="font-medium text-[16px]">{primaryText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
