
// // components/machine.tsx
// import { useState, useEffect } from "react";
// import axios from "axios";

// export interface Machine {
//   slug: string;
//   model: string;
//   price: string;
//   image: string;
//   description: string;
//   category: string;
//   specs: Record<string, string>;
// }

// export const useMachines = () => {
//   const [machines, setMachines] = useState<Machine[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchMachines = async () => {
//   setLoading(true);
//   setError(null);
//   try {
//     const response = await axios.get("/api/machines");
//     setMachines(response.data);
//   } catch (error) {
//     console.error("Fetch machines error:", error);
//     setError("Failed to fetch machines. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };

//   const addMachine = async (machineData: Omit<Machine, "specs"> & { specs: [string, string][] | Record<string, string> }) => {
//     setError(null);
//     try {
//       // Convert specs to object if needed
//       const specsObject =
//         Array.isArray(machineData.specs) ? Object.fromEntries(machineData.specs) : machineData.specs;

//       // Debug: log outgoing data
//       console.log("Adding machine:", { ...machineData, specs: specsObject });

//       const response = await axios.post("/api/machines", {
//         ...machineData,
//         specs: specsObject,
//       });

//       setMachines((prev) => [...prev, response.data]);
//       return response.data;
//     } catch (error) {
//       console.error("Add machine error:", error); // Debug: remove in production
//       setError("Failed to add machine. Please try again.");
//       throw error;
//     }
//   };

//   useEffect(() => {
//     fetchMachines();
//   }, []);

//   return { machines, loading, error, addMachine, refresh: fetchMachines };
// };

// components/machine.tsx
import { useState, useEffect } from "react";
import axios from "axios";

export interface Machine {
   slug: string;
  model: string;
  price: string; 
  image: string;
  description: string;
  category: string;
  specs: Record<string, string>;
}

export interface Category {
  name: string;
}

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchMachines = async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = category 
        ? `/api/machines?category=${encodeURIComponent(category)}`
        : '/api/machines';
      
      const response = await axios.get(url);
      setMachines(response.data);
    } catch (error) {
      console.error("Fetch machines error:", error);
      setError("Failed to fetch machines. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const addMachine = async (machineData: any) => {
    setError(null);
    try {
      const response = await axios.post("/api/machines", machineData);
      setMachines(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Add machine error:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to add machine");
      } else {
        setError("Failed to add machine. Please try again.");
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchMachines();
    fetchCategories();
  }, []);

  return {
    machines,
    categories,
    loading,
    error,
    addMachine,
    refresh: fetchMachines,
    refreshCategories: fetchCategories
  };
};