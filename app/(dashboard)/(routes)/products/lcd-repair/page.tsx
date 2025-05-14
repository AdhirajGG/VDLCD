

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { machines } from "@/components/machine";

// export default function LCDRepairPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleViewDetails = (productId: string) => {
//     setLoading(true); // Start the loading state
//     setTimeout(() => {
//       setLoading(false); // Stop the loading state after 2 seconds
//       router.push(`/products/${productId}`); // Navigate to the product details page
//     }, 2000); // 2-second delay
//   };

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">LCD Repair Equipment</h1>

//       {loading ? (
//         <div className="flex justify-center items-center h-screen">
//           {/* Modern Loader Animation */}
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {machines.map((machine, index) => (
//             <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
//               <div className="relative h-48 w-full mb-4">
//                 <Image
//                   src={machine.image}
//                   alt={machine.model}
//                   fill
//                   className="object-cover rounded-lg"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 />
//               </div>

//               <h2 className="text-xl font-semibold mb-2">{machine.model}</h2>
//               <p className="text-2xl font-bold text-primary mb-4">{machine.price}</p>

//               <div className="flex flex-col space-y-2">
//                 <Button
//                   onClick={() => handleViewDetails(machine.slug)}
//                   variant="outline"
//                   className="w-full"
//                 >
//                   View Details
//                 </Button>
//                 <Button
//                   onClick={() => router.push(`/checkout/${machine.slug}`)}
//                   className="w-full bg-green-600 hover:bg-green-700"
//                 >
//                   Buy Now
//                 </Button>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define the Machine interface
export interface Machine {
  slug: string;
  model: string;
  price: string;
  image: string;
  description: string;
  specs: Record<string, string>; // JSON object with string keys and values
}

// Custom hook to fetch and manage machines
export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/machines");
      setMachines(response.data);
    } catch (error) {
      console.error("Fetch machines error:", error);
      setError("Failed to fetch machines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addMachine = async (machineData: any) => {
    setError(null);
    try {
      const response = await axios.post("/api/machines/add", machineData);
      setMachines((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Add machine error:", error);
      setError("Failed to add machine. Please try again.");
      throw error;
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return { machines, loading, error, addMachine, refresh: fetchMachines };
};

// Main component for the LCD Repair page
export default function LCDRepairPage() {
  const { machines, loading, error } = useMachines();
  const router = useRouter();

  const handleViewDetails = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">LCD Repair Equipment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {machines.map((machine, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full mb-4">
              <Image
                src={machine.image}
                alt={machine.model}
             
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{machine.model}</h2>
            <p className="text-2xl font-bold text-primary mb-4">{machine.price}</p>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => handleViewDetails(machine.slug)}
                variant="outline"
                className="w-full"
              >
                View Details
              </Button>
              <Button
                onClick={() => router.push(`/checkout/${machine.slug}`)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Buy Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}