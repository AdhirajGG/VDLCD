// app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, CheckCircle, BarChart, Users, Shield, Globe, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Landing() {
    return (
        
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 relative">
      {/* Auth Buttons */}
      <div className="absolute right-4 top-4 flex gap-3 z-50">
        <Link href="/sign-in">
          <Button variant="outline" className="rounded-full px-6 gap-2 hover:bg-blue-50">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="rounded-full px-6 gap-2 bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4" />
            Register
          </Button>
        </Link>
      </div>
            
            {/* Hero Section */}
            <header className="container mx-auto px-4 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Transform Your Industrial Operations
                    </h1>
                    <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                        Advanced automation solutions for modern manufacturing and industrial enterprises
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                            Schedule Demo
                            <Rocket className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                            Learn More
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 border rounded-2xl shadow-xl overflow-hidden"
                >
                    <img
                        src="/industrial-dashboard.jpg"
                        alt="Industrial Automation Interface"
                        className="w-full h-[500px] object-cover"
                    />
                </motion.div>
            </header>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Enterprise-grade solutions trusted by industry leaders worldwide
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: BarChart, title: "Real-time Analytics", desc: "Comprehensive operational insights" },
                        { icon: Shield, title: "Military-grade Security", desc: "Industrial data protection" },
                        { icon: Globe, title: "Global Support", desc: "24/7 technical assistance" },
                        { icon: Users, title: "Team Collaboration", desc: "Cross-department workflows" },
                        { icon: CheckCircle, title: "Certified Compliance", desc: "Industry-standard certifications" },
                        { icon: Rocket, title: "Rapid Deployment", desc: "Cloud & on-premise solutions" },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-blue-900 text-white py-24">
                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-2">
                        <div className="text-5xl font-bold">500+</div>
                        <div className="text-slate-200">Industrial Clients</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-bold">99.9%</div>
                        <div className="text-slate-200">Uptime Guarantee</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-5xl font-bold">24/7</div>
                        <div className="text-slate-200">Global Support</div>
                    </div>
                </div>
            </section>

            {/* Add after Stats section */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex flex-wrap justify-center gap-12 opacity-70">
                    <img src="/cisco-logo.svg" className="h-12" alt="Cisco" />
                    <img src="/siemens-logo.svg" className="h-12" alt="Siemens" />
                    <img src="/ge-logo.svg" className="h-12" alt="General Electric" />
                    <img src="/rockwell-logo.svg" className="h-12" alt="Rockwell Automation" />
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-24 text-center">
                <div className="bg-white rounded-3xl shadow-xl p-12">
                    <h2 className="text-3xl font-bold mb-6">Ready to Modernize Your Operations?</h2>
                    <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                        Schedule a personalized demo to see our platform in action
                    </p>
                    <div className="max-w-md mx-auto space-y-4">
                        <Input placeholder="Your Name" className="rounded-full py-6" />
                        <Input placeholder="Work Email" className="rounded-full py-6" />
                        <Input placeholder="Company Name" className="rounded-full py-6" />
                        <Button size="lg" className="w-full rounded-full py-6 text-lg">
                            Request Demo
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}