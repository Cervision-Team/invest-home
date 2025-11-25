"use client";
import Footer from "@/components/common/Footer/Footer";
import SubFooter from "@/components/common/Footer/SubFooter";
import TabBar from "@/components/common/Footer/TabBar";
import ContactHeader from "@/components/common/Header/ContactHeader";
import Header from "@/components/common/Header/Header";
import ProtectedLayout from "@/components/router/ProtectedLayout";
import { LangProvider } from "@/context/LangContext";
import { MenuPermissionProvider } from "@/context/MenuPermissionContext";

export default function Layout({ children }) {
  return (
    <ProtectedLayout>
      <LangProvider>
        <MenuPermissionProvider>
          <main>
            <ContactHeader />
            <Header />
            {children}
            <TabBar />
            <Footer />
            <SubFooter />
          </main>
        </MenuPermissionProvider>
      </LangProvider>
    </ProtectedLayout>
  );
}
