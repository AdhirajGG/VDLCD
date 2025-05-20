// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMachines } from "@/components/machine";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  ListOrdered,
  Settings,
  ShoppingCart,
  Warehouse,
} from "lucide-react";

export default function Sidebar() { 
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { categories, refreshCategories } = useMachines();
  

  // Pull your category names out for the Products sub‑menu
  const productSubRoutes = categories.map((c) => ({
    label: c.name,
    href: `/products/category/${c.name.toLowerCase().replace(/\s+/g, "-")}`,
  }));

  // Single source of truth for your menu
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-blue-400",
    },
    {
      label: "Products",
      icon: Warehouse,
      href: "#",
      color: "text-purple-400",
      subRoutes: productSubRoutes,
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      href: "/cart",
      color: "text-orange-300",
    },
    {
      label: "Orders",
      icon: ListOrdered,
      href: "/orders",
      color: "text-violet-500",
    },
  ];



  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white py-4 space-y-4">
      <div className="px-3 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-2">
            <Image fill alt="Logo" src="/Logo.png" />
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            Neko
          </motion.h1>
        </Link>

        <nav className="space-y-1">
          {routes.map((route) => (
            <div key={route.label}>
              {/* if has a submenu */}
              {route.subRoutes && route.subRoutes.length > 0 ? (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === route.label ? null : route.label
                      )
                    }
                    className="w-full flex items-center justify-between p-3 text-sm font-medium rounded-lg transition hover:bg-white/10"
                  >
                    <div className="flex items-center">
                      <route.icon
                        className={cn("h-5 w-5 mr-3", route.color)}
                      />
                      {route.label}
                    </div>
                    {openDropdown === route.label ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </motion.button>

                  {openDropdown === route.label &&
                    route.subRoutes.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "flex items-center pl-8 p-2 text-sm rounded-lg transition hover:bg-white/10",
                          pathname === sub.href
                            ? "bg-white/10 text-white"
                            : "text-zinc-400"
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                </>
              ) : (
                /* simple link */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center p-3 text-sm font-medium rounded-lg transition hover:bg-white/10",
                      pathname === route.href
                        ? "bg-white/10 text-white"
                        : "text-zinc-400"
                    )}
                  >
                    <route.icon
                      className={cn("h-5 w-5 mr-3", route.color)}
                    />
                    {route.label}
                  </Link>
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
