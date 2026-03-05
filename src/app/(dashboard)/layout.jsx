"use client";
import Footer from "@/components/common/Footer/Footer";
import SubFooter from "@/components/common/Footer/SubFooter";
import TabBar from "@/components/common/Footer/TabBar";
import ContactHeader from "@/components/common/Header/ContactHeader";
import Header from "@/components/common/Header/Header";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import ProtectedLayout from "@/components/router/ProtectedLayout";
import ProtectedRoute from "@/components/router/ProtectedRoute";
import { LangProvider } from "@/context/LangContext";
import { MenuPermissionProvider } from "@/context/MenuPermissionContext";
import { UserProvider } from "@/context/UserContext";

export default function Layout({ children }) {
  return (
    <UserProvider>
      <MenuPermissionProvider>
        <LangProvider>
          <ProtectedLayout>
            <ProtectedRoute>
              <main className="bg-white">
                <ContactHeader />
                <Header />
                <section className="w-full">
                  <div className="max-w-[1600px] mx-auto px-20 max-[1025px]:px-5 max-[431px]:px-4">
                    <div className="flex flex-col lg:flex-row items-start gap-6 py-10">
                      <Sidebar variant="dashboard" />
                      <div className="flex-1 min-w-0 w-full">{children}</div>
                    </div>
                  </div>
                </section>
                <TabBar />
                <Footer />
                <SubFooter />
              </main>
            </ProtectedRoute>
          </ProtectedLayout>
        </LangProvider>
      </MenuPermissionProvider>
    </UserProvider>
  );
}
