// // commponents/Sidebar.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { Spirax as Font } from "next/font/google";
// import {
//   CarTaxiFront,
//   ChevronDown,
//   ChevronUp,
//   Headset,
//   LayoutDashboard,
//   Settings,
//   ShoppingCart,
//   Warehouse,
// } from "lucide-react";

// const font = Font({
//   weight: "400",
//   subsets: ["latin"],
// });

// export default function Sidebar() {
//   const pathname = usePathname();
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [categories, setCategories] = useState<string[]>([]);

//   // Fetch categories from API
//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const res = await fetch("/api/categories");
//         if (res.ok) {
//           const data: { name: string }[] = await res.json();
//           setCategories(data.map((c) => c.name));
//         }
//       } catch (error) {
//         console.error("Failed to load categories", error);
//       }
//     }
//     fetchCategories();
//   }, []);

//   // Build routes dynamically once categories are loaded
//   const routes = [
//     {
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       href: "/dashboard",
//       color: "text-sky-500",
//     },
//     {
//       label: "Products",
//       icon: Warehouse,
//       href: "#",
//       color: "text-pink-700",
//       subRoutes: [
//         ...categories.map((category) => ({
//           label: category,
//           href: `/products/category/${encodeURIComponent(category)}`,
//         })),
//       ],
//     },
//     {
//       label: "Cart",
//       icon: CarTaxiFront,
//       href: "/cart",
//       color: "text-orange-300",
//     },
//     {
//       label: "Orders",
//       icon: ShoppingCart,
//       href: "/orders",
//       color: "text-violet-500",
//     },
//     {
//       label: "Settings",
//       icon: Settings,
//       href: "/settings",
//       color: "text-zinc-400",
//     },
//   ];
// const formatCategorySlug = (name: string) => {
//     return name.toLowerCase().replace(/ /g, '-');
//   };

//   return (
//     <div className="flex flex-col h-full bg-[#111827] text-white space-y-4 py-4">
//       <div className="px-3 flex-1">
//         <Link href="/dashboard" className="flex items-center pl-3 mb-14">
//           <div className="relative w-8 h-8 mr-2">
//             <Image fill alt="Logo" src="/Logo.png" />
//           </div>
//           <h1 className={cn("text-2xl font-bold", font.className)}>Neko</h1>
//         </Link>

//         <nav className="space-y-1">
//           <div className="space-y-1">
//         {categories.map(category => (
//           <Link
//             key={category.name}
//             href={`/products/category/${formatCategorySlug(category.name)}`}
//             className={cn(
//               "text-sm flex p-2 w-full items-center font-medium cursor-pointer hover:bg-white/10 rounded-lg transition",
//               pathname === `/products/category/${formatCategorySlug(category.name)}` 
//                 ? "text-white bg-white/10" 
//                 : "text-zinc-400"
//             )}
//           >
//             <span className="ml-4">{category.name}</span>
//           </Link>
//         ))}
//           {routes.map((route) => (
//             <div key={route.label}>
//               {route.subRoutes ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setOpenDropdown(
//                         openDropdown === route.label ? null : route.label
//                       )
//                     }
//                     className={cn(
//                       "group flex w-full justify-between items-center p-3 text-sm font-medium rounded-lg transition hover:bg-white/10",
//                       pathname.startsWith(route.href) &&
//                         route.href !== "#" &&
//                         "bg-white/10 text-white",
//                       route.href === "#" && "text-zinc-400"
//                     )}
//                   >
//                     <div className="flex items-center flex-1">
//                       <route.icon
//                         className={cn("h-5 w-5 mr-3", route.color)}
//                       />
//                       {route.label}
//                     </div>
//                     {openDropdown === route.label ? (
//                       <ChevronUp className="h-4 w-4" />
//                     ) : (
//                       <ChevronDown className="h-4 w-4" />
//                     )}
//                   </button>

//                   {openDropdown === route.label && (
//                     <div className="ml-8 mt-1 space-y-1">
//                       {route.subRoutes.map((sub) => (
//                         <Link
//                           key={sub.href}
//                           href={sub.href}
//                           className={cn(
//                             "flex items-center w-full p-2 text-sm font-medium rounded-lg transition hover:bg-white/10",
//                             pathname === sub.href
//                               ? "bg-white/10 text-white"
//                               : "text-zinc-400"
//                           )}
//                         >
//                           <span className="ml-4">{sub.label}</span>
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <Link
//                   href={route.href}
//                   className={cn(
//                     "group flex items-center w-full p-3 text-sm font-medium rounded-lg transition hover:bg-white/10",
//                     pathname === route.href
//                       ? "bg-white/10 text-white"
//                       : "text-zinc-400"
//                   )}
//                 >
//                   <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
//                   {route.label}
//                 </Link>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }
// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Spirax as Font } from "next/font/google";
import {
  CarTaxiFront,
  ChevronDown,
  ChevronUp,
  Headset,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Warehouse,
} from "lucide-react";

const font = Font({
  weight: "400",
  subsets: ["latin"],
});

export default function Sidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data: { name: string }[] = await res.json();
          setCategories(data.map((c) => c.name));
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    }
    fetchCategories();
  }, []);

  // Helper to slugify category names
  const formatCategorySlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  // Static routes (Products will use dropdown for categories)
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
      href: "#",
      color: "text-pink-700",
      subRoutes: categories.map((category) => ({
        label: category,
        href: `/products/category/${formatCategorySlug(category)}`,
      })),
    },
    {
      label: "Cart",
      icon: CarTaxiFront,
      href: "/cart",
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
      color: "text-zinc-400",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white py-4 space-y-4">
      <div className="px-3 flex-1">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-2">
            <Image fill alt="Logo" src="/Logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", font.className)}>Neko</h1>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {routes.map((route) => (
            <div key={route.label}>
              {route.subRoutes && route.subRoutes.length > 0 ? (
                <>
                  {/* Parent button */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === route.label ? null : route.label
                      )
                    }
                    className={cn(
                      "group flex w-full justify-between items-center p-3 text-sm font-medium rounded-lg transition hover:bg-white/10",
                      pathname.startsWith(route.href) &&
                        route.href !== "#" &&
                        "bg-white/10 text-white",
                      route.href === "#" && "text-zinc-400"
                    )}
                  >
                    <div className="flex items-center flex-1">
                      <route.icon
                        className={cn("h-5 w-5 mr-3", route.color)}
                      />
                      {route.label}
                    </div>
                    {openDropdown === route.label ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {/* Dropdown items */}
                  {openDropdown === route.label && (
                    <div className="ml-8 mt-1 space-y-1">
                      {route.subRoutes.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "flex items-center w-full p-2 text-sm font-medium rounded-lg transition hover:bg-white/10",
                            pathname === sub.href
                              ? "bg-white/10 text-white"
                              : "text-zinc-400"
                          )}
                        >
                          <span className="ml-4">{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Simple link */
                <Link
                  href={route.href}
                  className={cn(
                    "group flex items-center w-full p-3 text-sm font-medium rounded-lg transition hover:bg-white/10",
                    pathname === route.href
                      ? "bg-white/10 text-white"
                      : "text-zinc-400"
                  )}
                >
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
