// types/razorpay.d.ts
// declare module "razorpay" {
//   class Razorpay {
//     constructor(options: any);
//     utils: {
//       generateSignature: (orderId: string, secret: string) => string;
//     };
//   }
//   export = Razorpay;
// }

// interface Window {
//   Razorpay: typeof import("razorpay");
// }
declare module "razorpay" {
  interface RazorpayOrders {
    create(options: any): Promise<any>;
  }

  class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: RazorpayOrders;
  }

  export = Razorpay;
}

interface Window {
  Razorpay: typeof import("razorpay");
}