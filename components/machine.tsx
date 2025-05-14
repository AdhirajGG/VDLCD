// export const machines = [
//   {
//     model: "VD-580-PD/680 PD",
//     price: "$6,000.00",
//     image: "/images/products/vd-580-pd.jpg",
//     detailsUrl: "/dashboard/products/vd-580-pd",
//     buyUrl: "/checkout/vd-580-pd"
//   },
//   {
//     model: "VD-580-PS/680 PS",
//     price: "$5,000.00",
//     image: "/images/products/vd-580-ps.jpg",
//     detailsUrl: "/dashboard/products/vd-580-ps",
//     buyUrl: "/checkout/vd-580-ps"
//   },
//   {
//     model: "VD512E Laser LCD Repair Machine",
//     price: "$17,000.00",
//     image: "/images/products/vd512e.jpg",
//     detailsUrl: "/dashboard/products/vd512e",
//     buyUrl: "/checkout/vd512e"
//   },
//   {
//     model: "VD-480-PS",
//     price: "$4,000.00",
//     image: "/images/products/vd-480-ps.jpg",
//     detailsUrl: "/dashboard/products/vd-480-ps",
//     buyUrl: "/checkout/vd-480-ps"
//   }
// ];

// Removed duplicate import of useState
"use client";
// export const machines = [
//   {
//     slug: "vd-580-pd",
//     model: "VD-580-PD/680 PD",
//     price: "$6,000.00",
//     image: "/images/products/vd-580-pd.jpg",
//     description: "VD-580-PD / 680 PD has been designed and manufactured by VD Intellisys Technologies P Ltd after thorough research. This product is suitable for bonding of FPC, COF, TAB and LCD panel and PCB. This machine is used across the world and widely popular among LCD repair technicians and manufacturers of TVs.",

//     specs: [
//       ["Equipment Model No.", "VD-580-PD / VD-680-PD"],
//       ["Device Description", "Screen Repair Machine/Bonding Machine"],
//       ["Equipment Features", `1. Different operating modes,\n2. Double Head Machine\n3. 3 level circuit control\n4. Robust design\n5. Vacuum Adsorption inbuilt\n6. Heavy Weight so no alignment problem`],
//       ["Device Usage", "This product is used in a variety of FPC, COF, TAB and LCD panel and PCB bonding. It can solve LCD vertical, horizontal, vertical band, horizontal belt and black belt and many such problems."],
//       ["Applicable LCD panel Specifications", "15'' – 85''"],
//       ["Applicable LCD panel Thickness", "0.3mm – 1.1mm [Single Glass]"],
//       ["Binding Direction", "X or Y unidirectional"],
//       ["Bonding Head Bit Size", "Replaceable blade according to IC specifications. The original machine is equipped with 45x1.5x10"],
//       ["Cylinder Device", "Japanese SMC original thin"],
//     ],
//   },
//   {
//     slug: "vd-580-ps",
//     model: "VD-580-PS/680 PS",
//     price: "$5,000.00",
//     image: "/images/products/vd-580-ps.jpg",
//     description:
//       "VD-580-PS / 680 PS has been designed and manufactured by VD Intellisys Technologies P Ltd after thorough research. This product is suitable for bonding of FPC, COF, TAB, LCD panels, and PCBs. It is widely used across the world and is a popular choice among LCD repair technicians and TV manufacturers due to its precision and reliability.",
//     specs: [
//       ["Equipment Model No.", "VD-580-PS / VD-680-PS"],
//       ["Manufacturer Company", "VD Intellisys Technologies Pvt Ltd"],
//       ["Device Description", "Screen Repair Machine/Bonding Machine"],
//       ["Equipment Features", "1. Different operating modes\n2. Accurate heating algorithm\n3. Slider based pneumatic system for accuracy\n4. Vacuum Adsorption inbuilt\n5. Inbuilt backlight"],
//       ["Device Usage", "Used in a variety of FPC, COF, TAB, and LCD panel and PCB bonding. Solves vertical/horizontal banding, black belt, and similar LCD issues."],
//       ["Applicable LCD Panel Specifications", "6'' - 85''"],
//       ["Applicable LCD Panel Thickness", "0.3mm - 1.1mm [Single Glass]"],
//       ["Bonding Direction", "X or Y unidirectional"],
//       ["Bonding Head Bit Size", "Replaceable blade (original: 45 x 1.5 x 10)"],
//       ["Device Processing Time", "TFT: 3.8s/chip"],
//       ["Production Capacity", "TAB: 100 pcs/hr"],
//       ["Bonding Accuracy", "Within ± 1.5μm (Supports 4K screen)"],
//       ["Highest Positioning Accuracy", "± 0.5μm (World-leading precision)"],
//       ["Environmental Requirements", "Clean, dust-free environment"],
//       ["Power Supply", "AC 220V±10%, 50/60Hz, 3500W"],
//       ["Cylinder Device", "Japanese SMC original thin cylinder"],
//       ["Pressure System", "SMC system combined with VD Technologies"],
//       ["Heating Type", "Pulse heating with rapid heating/cooling and auxiliary cooling"],
//       ["PID Temperature Control", "Delta PID, adjustable curve, ±3°C peak accuracy"],
//       ["Thermal Response", "Room temperature to 180°C in 2–3 seconds"],
//       ["Hot Pressing Material", "Japanese Titanium head (US origin), plane precision: 0.001mm"],
//       ["Thermocouple Type", "K-type, Original US OMEGA wire"],
//       ["Control Units/Programmer", "SIEMENS / PANASONIC / DELTA PLC"],
//       ["Touch Unit", "DELTA touch screen"],
//       ["Image Unit", "2 cameras, 30–120x zoom, 19\" HD display, COF counterpoint with upper light source"],
//       ["COF Alignment Unit", "Taiwan origin, U-rail (2056 high), accuracy 0.01, X/Y/θ adjustable, θ: coarse 360°, fine ±5°"],
//       ["COF Fixture", "Mechanical clamping type, Z tilt with micrometer motion"],
//       ["Lens Spinner", "X/Y/Z micrometer control, manual focus"],
//       ["Silicone / Teflon Switch", "Manual position switching"],
//       ["LCD Stage", "Manual sliding or fixed (optional)"],
//       ["Alarm System", "Alerts for abnormal pressure, temperature, thermocouple issues"],
//       ["Hot Press Head Counterpoint", "Cylinder can stop at any vertical position"],
//       ["Control Mode", "Touch screen + physical buttons"],
//       ["Parameter Setting", "Temperature profiles can be saved"],
//       ["Rated Voltage", "180–220V (customizable 110V)"],
//       ["Peak Power", "400–1100W"],
//       ["Maximum Power", "1100W"],
//       ["Actual Power", "580W"],
//       ["Body Size", "1200 × 1500 × 1800mm (L×W×H)"]
//     ]
//     ,
//   },
//   {
//     slug: "vd512e",
//     model: "VD512E Laser LCD Repair Machine",
//     price: "$17,000.00",
//     image: "/images/products/vd512e.jpg",
//     description:
//       "The VD512E Laser LCD Repair Machine, manufactured by VD Intellisys Technologies Pvt Ltd, is a highly advanced machine designed specifically for repairing TFT panels. This laser machine is capable of repairing internal faults within the LCD panel glass used in LCD/LED TVs and laptop screens. It effectively addresses issues like bright lines, dark lines, horizontal lines, pixel defects, half lines, and scanning line problems.",
//     specs: [
//       ["Equipment Model No.", "VD512E"],
//       ["Material", "Sheet Metal Steel"],
//       ["Power Source", "15 amp"],
//       ["Brand", "VD"],
//       ["Voltage", "230 V"],
//       ["Panel Size Supported", "Up to 85 inch"],
//       ["Cooling System", "Water Tank Box"],
//       ["Machine Dimensions", "1560mm × 1400mm × 1700mm"],
//       ["Wavelength", "1064nm / 532nm IR/GR"],
//       ["Repairable Size", "Up to 65″"],
//       ["Workbench Size", "890mm × 1540mm"],
//       ["Objective Lens Options", "2x, 5x, 10x, 20x"],
//       ["Optical Lens Barrel", "VD"],
//       ["Server System", "DELTA"],
//       ["Touch Unit", "MITSUBISHI"],
//       ["Control System", "DELTA"],
//       ["Turn Table", "VD"],
//       ["Air Compressor", "OTS-550"],
//       ["Laser Type", "With Digital Bar"],
//       ["Minimum Order Quantity", "1 Set"]
//     ],
//   },
//   {
//     slug: "vd-480-ps",
//     model: "VD-480-PS",
//     price: "$4,000.00",
//     image: "/images/products/vd-480-ps.jpg",
//     description:
//       "VD-480-PS is a compact and efficient LCD repair machine designed for small-scale repair operations.",
//     specs: [
//       ["Equipment Model No.", "VD-480-PS"],
//       ["Manufacturer Company", "VD Intellisys Technologies Pvt Ltd"],
//       ["Applicable LCD panel Specifications", `5'' – 85''`],
//       ["Bonding direction", "X or Y unidirectional"],
//       ["Bonding Head Bit size", "Replaceable blade (45 × 1.5 × 10)"],
//       ["Bonding Accuracy", "Within ± 1.5μm (Supports 4K)"],
//       ["HMI", "Coolmay Taiwanese"],
//       ["PLC", "Mitsubishi"],
//       ["Power Supply", "AC 220V±10%, 50Hz, 3500W"],
//       ["Cylinder Device", "Japan SMC original thin cylinder"],
//       ["PID Temperature Control", "COOLMAY Taiwanese"],
//       ["Control", "Delta"],
//     ],
//   },
// ];


// Export a hook to manage the machines array




import { useState, useEffect } from "react";
import axios from "axios";

// Define the Machine interface
export interface Machine {
  slug: string;
  model: string;
  price: string;
  image: string;
  description: string;
  specs: Record<string, string>; // JSON object with string keys and values
}

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

// components/machine.tsx
// In your useMachines hook (components/machine.tsx)
const addMachine = async (machineData: Machine) => {
  setError(null);
  try {
    // Convert array to object just before sending
    const specsObject = Array.isArray(machineData.specs) 
      ? Object.fromEntries(machineData.specs)
      : machineData.specs;

    const response = await axios.post("/api/addMachines", {
      ...machineData,
      specs: specsObject
    });
    
    // Add the machine with original array format
    setMachines(prev => [...prev, { 
      ...response.data,
      specs: Object.entries(response.data.specs) 
    }]);
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