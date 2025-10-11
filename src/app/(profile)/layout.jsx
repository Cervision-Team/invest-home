import Footer from "@/components/common/Footer/Footer";
import SubFooter from "@/components/common/Footer/SubFooter";
import TabBar from "@/components/common/Footer/TabBar";
import ContactHeader from "@/components/common/Header/ContactHeader";
import Header from "@/components/common/Header/Header";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import ProtectedRoute from "@/components/router/ProtectedRoute";
import { LangProvider } from "@/context/LangContext";

export default function Layout({ children }) {

    return (
        <ProtectedRoute>

            <LangProvider>
                <main>
                    <ContactHeader />
                    <Header />
                    <div className="flex mt-[40px] mx-[80px] gap-[24px]">
                        <Sidebar />
                        {children}
                    </div>
                    <TabBar />
                    <Footer />
                    <SubFooter />

                </main>
            </LangProvider >
        </ProtectedRoute>

    )
}