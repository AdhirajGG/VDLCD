
// // app/(dashboard)/(routes)/orders/page.tsx
// "use client";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useEffect, useState } from "react";
// import { useUser, useAuth } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// interface OrderItem {
//   slug: string;
//   model: string;
//   quantity: number;
//   price: number;
// }

// interface Order {
//   id: string;
//   userId: string;
//   items: string; // JSON string of OrderItem[]
//   total: number;
//   createdAt: string;
// }

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { user, isSignedIn } = useUser();
//   const { getToken } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isSignedIn) {
//       router.push("/sign-in");
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         const token = await getToken();
//         if (!token) {
//           throw new Error("No authentication token found");
//         }
//         const { data } = await axios.get("/api/orders", {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         setOrders(data);
//       } catch (err) {
//         setError("Failed to load orders");
//         toast.error("Could not fetch your orders");
//         console.error("Order fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [isSignedIn, router, user, getToken]);

//   if (!isSignedIn) {
//     return null; // Redirecting, show nothing briefly
//   }

//   if (loading) {
//     return (
//       <div className="p-8 max-w-4xl mx-auto">
//         {[1, 2, 3].map((i) => (
//           <Card key={i} className="mb-4">
//             <CardContent className="p-4">
//               <Skeleton className="h-6 w-48 mb-4" />
//               <div className="space-y-2">
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-3/4" />
//                 <Skeleton className="h-4 w-1/2" />
//               </div>
//               <Skeleton className="h-6 w-32 mt-4 ml-auto" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 max-w-4xl mx-auto text-center text-destructive">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-8 max-w-4xl mx-auto"
//     >
//       <motion.h1
//         initial={{ y: -20 }}
//         animate={{ y: 0 }}
//         className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//       >
//         Your Orders
//       </motion.h1>

//       {orders.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center text-muted-foreground"
//         >
//           No orders found
//         </motion.div>
//       ) : (
//         orders.map((order) => (
//           <motion.div
//             key={order.id}
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="mb-4 hover:shadow-lg transition-shadow">
//               <CardContent className="p-4">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Product</TableHead>
//                       <TableHead>Quantity</TableHead>
//                       <TableHead>Price</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {JSON.parse(order.items).map((item: OrderItem) => (
//                       <TableRow key={item.slug}>
//                         <TableCell className="font-medium">
//                           {item.model}
//                         </TableCell>
//                         <TableCell>{item.quantity}</TableCell>
//                         <TableCell>
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//                 <div className="mt-4 flex justify-between items-center">
//                   <div className="text-muted-foreground text-sm">
//                     Ordered on:{" "}
//                     {new Date(order.createdAt).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </div>
//                   <div className="text-xl font-bold text-primary">
//                     Total: ${order.total.toFixed(2)}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))
//       )}
//     </motion.div>
//   );
// }

// app/(dashboard)/(routes)/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  slug: string;
  model: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  items: string; // JSON string of OrderItem[]
  total: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");
        const { data } = await axios.get<Order[]>("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not fetch your orders");
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, getToken, router]);

  if (!isSignedIn) return null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 max-w-7xl mx-auto min-h-screen"
      >
        {/* you can insert Skeletons here */}
        <p>Loading orders…</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto min-h-screen"
    >
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Order History
        </motion.h1>

        {error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            No orders found
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items: OrderItem[] = JSON.parse(order.items);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/50 hover:border-cyan-400/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-100">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-indigo-300 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      Completed
                    </Badge>
                  </div>

                  <div className="grid gap-4">
                    {items.map((item) => (
                      <div
                        key={item.slug}
                        className="flex justify-between items-center py-2 border-b border-indigo-800/50"
                      >
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.model}
                              className="w-12 h-12 object-contain rounded-lg"
                            />
                          )}
                          <div>
                            <p className="text-indigo-100">{item.model}</p>
                            <p className="text-sm text-indigo-300">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="text-indigo-100">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <p className="text-indigo-300 text-sm">
                      Payment Method: Credit Card
                    </p>
                    <p className="text-xl font-bold text-cyan-400">
                      Total: ${order.total.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
