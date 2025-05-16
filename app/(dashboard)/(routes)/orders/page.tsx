// // app/(dashboard)/(routes)/orders/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<any[]>([]);

//   useEffect(() => {
//     axios.get("/api/orders").then(res => setOrders(res.data));
//   }, []);

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
//       {orders.map(order => (
//         <Card key={order.id} className="mb-4">
//           <CardContent className="p-4">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product</TableHead>
//                   <TableHead>Quantity</TableHead>
//                   <TableHead>Price</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {JSON.parse(order.items).map((item: any) => (
//                   <TableRow key={item.slug}>
//                     <TableCell>{item.model}</TableCell>
//                     <TableCell>{item.quantity}</TableCell>
//                     <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <div className="mt-4 text-right font-bold">
//               Total: ${order.total.toFixed(2)}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// app/(dashboard)/(routes)/orders/page.tsx
"use client";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/orders")
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        {[1,2,3].map((i) => (
          <Card key={i} className="mb-4">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-6 w-32 mt-4 ml-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      {orders.map(order => (
        <motion.div
          key={order.id}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <Card className="mb-4 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {JSON.parse(order.items).map((item: any) => (
                    <TableRow key={item.slug}>
                      <TableCell className="font-medium">{item.model}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right font-bold text-primary">
                Total: ${order.total.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}