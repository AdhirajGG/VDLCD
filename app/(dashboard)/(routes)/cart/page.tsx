// app/(dashboard)/(routes)/cart/page.tsx
"use client"
import { useCart } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart()
  const router = useRouter()
const [isClient, setIsClient] = useState(false);
useEffect(() => {
  setIsClient(true);
}, []);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
    {!isClient ? (
      <p>Loading...</p>
    ) : cartItems.length === 0 ? (
      <p>Your cart is empty</p>
    ) : (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map(item => (
              <TableRow key={item.slug}>
                <TableCell className="font-medium">{item.model}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item.slug)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 flex justify-between items-center">
          <div className="text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>
          <div className="space-x-4">
            <Button
              onClick={clearCart}
              variant="outline"
            >
              Clear Cart
            </Button>
            <Button
              onClick={() => router.push(`/checkout/cart`)}
              className="bg-green-600 hover:bg-green-700"
            >
              Checkout All
            </Button>
          </div>
        </div>
      </>
    )}
    </div>
  )
}