import Footer from "@/components/common/Footer/Footer";
import SubFooter from "@/components/common/Footer/SubFooter";
import TabBar from "@/components/common/Footer/TabBar";
import ContactHeader from "@/components/common/Header/ContactHeader";
import Header from "@/components/common/Header/Header";
import { LangProvider } from "@/context/LangContext";

export default function Layout({ children }) {
    
    return (
        <LangProvider>
            <main>
                <ContactHeader />
                <Header />
                {children}
                <TabBar />
                <Footer />
                <SubFooter />
               
            </main>
        </LangProvider >
    )
}