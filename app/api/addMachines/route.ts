import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      
      // Convert specs array to object
      if (Array.isArray(data.specs)) {
        data.specs = Object.fromEntries(data.specs);
      }

      const machine = await prisma.machine.create({
        data: {
          slug: data.slug,
          model: data.model,
          price: data.price,
          image: data.image,
          description: data.description,
          category: data.category,
          specs: data.specs
        }
      });

      return res.status(201).json(machine);
    } catch (error: any) {
      console.error("Add machine error:", error);
      return res.status(500).json({ 
        error: error.message || "Failed to add machine",
        details: error
      });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}