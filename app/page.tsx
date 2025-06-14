// app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Factory, CircuitBoard, Shield, Rocket, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import LandingNavbar from "@/components/landing-navbar";

export default function Landing() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b   from-indigo-950 to-slate-900 relative">
       <LandingNavbar />

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Industrial Automation Solutions
          </h1>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Transforming manufacturing through advanced control systems and IoT integration
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-indigo-600 hover:bg-indigo-700">
              Schedule Demo
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 rounded-2xl overflow-hidden border border-indigo-800/50 shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
            alt="Industrial Automation"
            className="w-full h-[500px] object-cover"
            width={800}
            height={800}
          />
        </motion.div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-indigo-100">Why Choose VDLCD?</h2>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            Enterprise-grade industrial automation solutions trusted by global manufacturers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: CircuitBoard, title: "Smart Control Systems", desc: "Real-time monitoring and control" },
            { icon: Shield, title: "Cybersecurity", desc: "Industrial-grade security protocols" },
            { icon: Factory, title: "Line Integration", desc: "Seamless production line integration" },
            { icon: Rocket, title: "Rapid Deployment", desc: "Cloud & on-premise solutions" },
            { icon: Factory, title: "PLC Programming", desc: "Customized automation logic" },
            { icon: CircuitBoard, title: "IoT Enabled", desc: "Industry 4.0 ready solutions" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-indigo-900/30 border-indigo-800/50 hover:border-indigo-500 transition-colors">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-cyan-400 mb-4" />
                  <CardTitle className="text-indigo-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-300">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-900/40 py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-bold text-cyan-400">200+</div>
            <div className="text-indigo-200">Automation Projects</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-cyan-400">99.98%</div>
            <div className="text-indigo-200">System Uptime</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-cyan-400">24/7</div>
            <div className="text-indigo-200">Global Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          className="bg-gradient-to-r from-indigo-900 to-cyan-900/50 rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-100">Ready to Automate Your Production?</h2>
          <p className="text-indigo-300 mb-8 max-w-xl mx-auto">
            Connect with our industrial automation experts today
          </p>
          <div className="max-w-md mx-auto space-y-4">
            <input
              placeholder="Your Name"
              className="w-full rounded-full bg-indigo-800/30 border border-indigo-700 px-6 py-4 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              placeholder="Work Email"
              className="w-full rounded-full bg-indigo-800/30 border border-indigo-700 px-6 py-4 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Button
              size="lg"
              className="w-full rounded-full py-6 text-lg bg-cyan-500 hover:bg-cyan-600"
            >
              Request Consultation
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}