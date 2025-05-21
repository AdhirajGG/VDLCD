import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const testUser = await prisma.user.upsert({
    where: { clerkId: 'user_2example123' },
    update: {},
    create: {
      clerkId: 'user_2example123',
      lastActiveAt: new Date(),
    },
  });

  // Create test order
  const order = await prisma.order.create({
    data: {
      id: uuidv4(),
      userId: testUser.id,
      total: 299.97,
      items: JSON.stringify([
        {
          slug: 'excavator-xyz',
          model: 'XYZ Excavator',
          quantity: 1,
          price: 199.99,
          image: '/excavator.jpg'
        },
        {
          slug: 'bulldozer-abc',
          model: 'ABC Bulldozer',
          quantity: 2,
          price: 49.99,
          image: '/bulldozer.jpg'
        }
      ]),
      paymentMethod: "Razorpay",
      status: "COMPLETED",
      razorpayOrderId: "order_123456789",
      razorpayPaymentId: "pay_123456789",
      razorpaySignature: "signature_123456789"
    }
  });

  console.log('Created test order:', order);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });