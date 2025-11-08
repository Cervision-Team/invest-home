import Footer from "@/components/common/Footer/Footer";
import SubFooter from "@/components/common/Footer/SubFooter";
import TabBar from "@/components/common/Footer/TabBar";
import ContactHeader from "@/components/common/Header/ContactHeader";
import Header from "@/components/common/Header/Header";
import Sidebar from "@/components/common/Sidebar/Sidebar";
// import ProtectedRoute from "@/components/router/ProtectedRoute";
import { LangProvider } from "@/context/LangContext";

// ✅ Pass only serializable values (strings, not functions)
const dashboardSidebarItems = [
  { title: "Profilim", href: "/profile", icon: "profile" },
  { title: "Statistika", href: "/statistics", icon: "statistic" },
  { title: "Əməkdaşlar", href: "/employees", icon: "employees" },
  { title: "Elan bazası", href: "/database-table", icon: "database" },
  { title: "Sifarişlər", href: "/orders", icon: "order" },
  { title: "Müştərilər", href: "/customers", icon: "customer" },
  { title: "Balansım", href: "/wallet", icon: "wallet" },
  { title: "Ödəniş tarixçəsi", href: "/transaction-history", icon: "wallet" },
];

export default function Layout({ children }) {
  return (
    // <ProtectedRoute>
    <LangProvider>
      <main className="bg-white">
        <ContactHeader />
        <Header />
        <div className="flex mt-10 mx-20 gap-6">
          <Sidebar items={dashboardSidebarItems} variant="dashboard"/>
          {children}
        </div>
        <TabBar />
        <Footer />
        <SubFooter />
      </main>
    </LangProvider>
    // </ProtectedRoute>
  );
}
