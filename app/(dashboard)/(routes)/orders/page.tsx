// app/(dashboard)/(routes)/orders/page.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/orders").then(res => setOrders(res.data));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      {orders.map(order => (
        <Card key={order.id} className="mb-4">
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
                    <TableCell>{item.model}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-right font-bold">
              Total: ${order.total.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}