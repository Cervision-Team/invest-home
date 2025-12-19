"use client";
import Footer from "@/components/common/Footer/Footer";
import SubFooter from "@/components/common/Footer/SubFooter";
import TabBar from "@/components/common/Footer/TabBar";
import ContactHeader from "@/components/common/Header/ContactHeader";
import Header from "@/components/common/Header/Header";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import ProtectedLayout from "@/components/router/ProtectedLayout";
import ProtectedRoute from "@/components/router/ProtectedRoute";
// import ProtectedRoute from "@/components/router/ProtectedRoute";
import { LangProvider } from "@/context/LangContext";
import { MenuPermissionProvider } from "@/context/MenuPermissionContext";
import { UserProvider } from "@/context/UserContext";

// ✅ Pass only serializable values (strings, not functions)
const dashboardSidebarItems = [
  { name: "Profilim", path: "/profile", icon: "profile" },
  { name: "Statistika", path: "/statistics", icon: "statistic" },
  { name: "Əməkdaşlar", path: "/employees", icon: "employees" },
  { name: "Elan bazası", path: "/database-table", icon: "database" },
  { name: "Sifarişlər", path: "/orders", icon: "order" },
  { name: "Müştərilər", path: "/customers", icon: "customer" },
  { name: "Balansım", path: "/wallet", icon: "wallet" },
  { name: "Ödəniş tarixçəsi", path: "/transaction-history", icon: "wallet" },
];

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
    <ProtectedLayout>
      <UserProvider>
        <MenuPermissionProvider>
          <LangProvider>
            <main className="bg-white">
              <ContactHeader />
              <Header />
              <div className="flex flex-col lg:flex-row items-start gap-6 px-4 sm:px-6 lg:px-10 xl:px-20 mt-6 lg:mt-10">
                <Sidebar variant="dashboard" />
                <div className="flex-1 min-w-0 w-full">{children}</div>
              </div>
              <TabBar />
              <Footer />
              <SubFooter />
            </main>
          </LangProvider>
        </MenuPermissionProvider>
      </UserProvider>
    </ProtectedLayout>
    </ProtectedRoute>
  );
}
