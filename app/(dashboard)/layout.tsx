// app/(dashboard)/layout.tsx
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/cart-context"


const DashboardLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <CartProvider>
            <div className="h-full relative">
                <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                    <Sidebar />
                </div>
                <main className="md:pl-72">
                    <Navbar />
                    {children}
                    <Toaster />
                </main>
            </div>
        </CartProvider>
    );
}

export default DashboardLayout;