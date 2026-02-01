"use client";
import Footer from "@/components/common/Footer/Footer";
import SubFooter from "@/components/common/Footer/SubFooter";
import TabBar from "@/components/common/Footer/TabBar";
import ContactHeader from "@/components/common/Header/ContactHeader";
import Header from "@/components/common/Header/Header";
import ScrollToTop from "@/components/core/ScrollToTop";
// import ProtectedLayout from "@/components/router/ProtectedLayout";
import { LangProvider } from "@/context/LangContext";
import { MenuPermissionProvider } from "@/context/MenuPermissionContext";
import { UserProvider } from "@/context/UserContext";

export default function Layout({ children }) {
  return (
    // <ProtectedLayout>
      <LangProvider>
        <UserProvider>
          <MenuPermissionProvider>
            <main>
              <ScrollToTop/>
              <ContactHeader />
              <Header />
              {children}
              <TabBar />
              <Footer />
              <SubFooter />
            </main>
          </MenuPermissionProvider>
        </UserProvider>
      </LangProvider>
    // </ProtectedLayout>
  );
}
