import { LangProvider } from "@/context/LangContext";
import BeAgent from "../Home/BeAgent";
import ScrollToTop from "@/components/core/ScrollToTop";
import ClientCategoryWrapper from "@/components/core/ClientCategoryWrapper";
import ClientSliderWrapper from "@/components/core/ClientSliderWrapper";

export default function Layout({ children }) {
    return (
        <LangProvider>
            <main>
                <ScrollToTop />
                <ClientSliderWrapper />
                <ClientCategoryWrapper />
                {children}
                <BeAgent />
            </main>
        </LangProvider >
    )
}