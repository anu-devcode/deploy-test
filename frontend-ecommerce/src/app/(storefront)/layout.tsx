import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SideCart } from "@/components/cart/SideCart";
import { LiveAnnouncements } from "@/components/layout/LiveAnnouncements";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <Navbar />
            <SideCart />
            <LiveAnnouncements />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </div>
    );
}
