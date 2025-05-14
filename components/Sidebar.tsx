// "use client";
// // New_Rocker , Spirax font from Google Fonts
// import { cn } from "@/lib/utils";
// import {
//     Code,
//     Headset,
//     ImageIcon,
//     LayoutDashboard,
//     MessagesSquare,
//     Music,
//     Settings,
//     ShoppingCart,
//     VideoIcon,
//     Warehouse
// } from "lucide-react";

// import { Spirax as Font } from "next/font/google";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const font = Font({
//     weight: '400',
//     subsets: ['latin']
// });

// // Need to change the routes to the correct ones
// const routes = [
//     {
//         label: "Dashboard",
//         icon: LayoutDashboard,
//         href: "/dashboard",
//         color: "text-sky-500",
//     },
   
//     {
//         label: "Products",
//         icon: Warehouse,
//         href: "/products",
//         color: "text-pink-700",
//     },
//     {
//         label: "Support",
//         icon: Headset,
//         href: "/support",
//         color: "text-orange-300",
//     }, 
//     {
//         label: "Orders",
//         icon: ShoppingCart,
//         href: "/orders",
//         color: "text-violet-500",
//     },
//     {
//         label: "Settings",
//         icon: Settings,
//         href: "/settings",
//     },
// ]

// const Sidebar = () => {
//     const pathname = usePathname()
//     return (
//         <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
//             <div className=" px-3 py-2 flex-1 ">
//                 <Link href="/dashboard" className="flex items-center pl-3 mb-14">
//                     <div className="relative w-8 h-8 mr-2">
//                         <Image
//                             fill
//                             alt="Logo"
//                             src="/Logo.png"
//                         />
//                     </div>
//                     <h1 className={cn("text-2xl font-bold", font.className)}>
//                         Neko
//                     </h1>
//                 </Link>
//                 <div className="space-y-1">
//                     {routes.map((route) => (
//                         <Link
//                             href={route.href}
//                             key={route.href}
//                             className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white hover:bg-white/10 rounded-lg transition",pathname ===route.href ? "text-white bg-white/10" : "text-zinc-400")}
//                         >

//                             <div className='flex items-center flex-1'>
//                                 <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
//                                 {route.label}
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Sidebar;
"use client";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Headset,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Warehouse
} from "lucide-react";
import { Spirax as Font } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const font = Font({
  weight: '400',
  subsets: ['latin']
});

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Products",
    icon: Warehouse,
    href: "#", // Use # for parent dropdown
    color: "text-pink-700",
    subRoutes: [
      {
        label: "LCD Repair Equipment",
        href: "/products/lcd-repair",
      },
      {
        label: "SMT Tools",
        href: "/products/smt-tools",
      },
      {
        label: "Rework Stations",
        href: "/products/rework-stations",
      }
    ]
  },
  {
    label: "Support",
    icon: Headset,
    href: "/support",
    color: "text-orange-300",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/orders",
    color: "text-violet-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
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
            <div key={route.href}>
              {route.subRoutes ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === route.label ? null : route.label)}
                    className={cn(
                      "text-sm group flex p-3 w-full justify-between items-center font-medium cursor-pointer hover:bg-white/10 rounded-lg transition",
                      pathname.startsWith(route.href) ? "text-white bg-white/10" : "text-zinc-400"
                    )}
                  >
                    <div className='flex items-center flex-1'>
                      <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                      {route.label}
                    </div>
                    {openDropdown === route.label ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {openDropdown === route.label && (
                    <div className="ml-8 space-y-1">
                      {route.subRoutes.map((subRoute) => (
                        <Link
                          key={subRoute.href}
                          href={subRoute.href}
                          className={cn(
                            "text-sm flex p-2 w-full items-center font-medium cursor-pointer hover:bg-white/10 rounded-lg transition",
                            pathname === subRoute.href ? "text-white bg-white/10" : "text-zinc-400"
                          )}
                        >
                          <span className="ml-4">{subRoute.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/10 rounded-lg transition",
                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                  )}
                >
                  <div className='flex items-center flex-1'>
                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                    {route.label}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;