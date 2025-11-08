import Sidebar from "@/components/common/Sidebar/Sidebar";
import { LangProvider } from "@/context/LangContext";

const servicesSidebarItems = [
  { title: "Kirayə müqaviləsi", href: "/contract-services/rental-agreement", icon: "document" },
  { title: "Yaşayış otağının kirayəsi", href: "/contract-services/living-room-rental", icon: "livingRoomRental" },
  { title: "İcarə müqaviləsi", href: "/contract-services/tenancy-agreement", icon: "tenancyAgreement" },
  { title: "Beh müqaviləsi", href: "/contract-services/deposit-agreement", icon: "depositAgreement" },
  { title: "Təhvil-təslim haqqında razılaşma", href: "/contract-services/handover-agreement", icon: "handoverAgreement" },
  { title: "Təhvil-təslim aktı", href: "/contract-services/deed-of-handover", icon: "deedOfHandover" },
];

export default function Layout({ children }) {
  return (
    <LangProvider>
      <div className="flex mt-10 gap-10 px-[80px]">
        <Sidebar items={servicesSidebarItems} variant="services"/>
        {children}
      </div>
    </LangProvider>
  );
}
