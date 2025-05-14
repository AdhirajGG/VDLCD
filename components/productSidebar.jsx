"use client";
// New_Rocker , Spirax font from Google Fonts
import { cn } from "@/lib/utils";
import {
    Hash,
    Headset,
    LayoutDashboard,
    ShoppingCart,
    Warehouse
} from "lucide-react";

import { Spirax as Font } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const font = Font({
    weight: '400',
    subsets: ['latin']
});

// Need to change the routes to the correct ones
const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
//    Products
// lcd repair equipment
// SMT TOOLS
// REWORK STATIONS
    {
        label: "lcd repair equipment",
        icon: Hash,
        href: "/lcd-repair-equipment",
        color: "text-pink-700",
    },
    {
        label: "SMT Tools",
        icon: Hash,
        href: "/smt-tools",
        color: "text-orange-300",
    }, 
    {
        label: "Rework Stations",
        icon: Hash,
        href: "/rework-stations",
        color: "text-violet-500",
    },
]

const ProductSidebar = () => {
    const pathname = usePathname()
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className=" px-3 py-2 flex-1 ">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-2">
                        <Image
                            fill
                            alt="Logo"
                            src="/Logo.png"
                        />
                    </div>
                    <h1 className={cn("text-2xl font-bold", font.className)}>
                        Neko
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white hover:bg-white/10 rounded-lg transition",pathname ===route.href ? "text-white bg-white/10" : "text-zinc-400")}
                        >

                            <div className='flex items-center flex-1'>
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductSidebar;