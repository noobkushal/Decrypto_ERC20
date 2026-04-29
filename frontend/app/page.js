"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Shield, ShieldCheck, Terminal, Cpu, ArrowRight, Code } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";

export default function Home() {
  const { account, chainId } = useWallet();
  const isSepolia = chainId === "0xaa36a7";
  const [isNavigating, setIsNavigating] = useState(false);
  
  return (
    <div className="space-y-32 pb-24 page-fade-in">
      {/* Global Progress Bar for navigation feedback */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-industrial-emerald origin-left animate-progress" style={{ display: 'block' }} />
      )}
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center pt-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div className="flex items-center gap-2 text-industrial-emerald font-black uppercase tracking-widest text-[10px]">
            <div className="w-2 h-2 rounded-full bg-industrial-emerald animate-pulse" />
            Live Audited Templates
          </div>
          
          <h1 className="heading-xl leading-[0.9]">
            Deploying <br />
            <span className="text-industrial-gray-500">Tokens</span> <br />
            is Intimidating.
          </h1>

          <p className="text-industrial-gray-500 font-medium max-w-lg">
            Deploying tokens is intimidating for non-developers — founders, DAOs, community managers all want tokens but copy-paste OpenZeppelin contracts they do not understand, often with bugs. A no-code wizard with audited templates lowers the barrier and reduces the rate of broken token launches. Vesting is added because every legitimate token launch needs it (team allocations, investor lockups), and most rugpull-style launches skip it.
          </p>

          <div className="flex gap-4">
            <Link 
              href="/wizard" 
              onClick={() => setIsNavigating(true)}
              className="industrial-button-primary flex items-center gap-2"
            >
              Start Forging
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="industrial-button-secondary">
              View Audits
            </button>
          </div>
        </motion.div>

        <div className="relative">
          <div className="aspect-[4/3] bg-industrial-gray-900 shadow-2xl border-8 border-white/10 backdrop-blur-3xl flex items-center justify-center">
             <Terminal className="w-32 h-32 text-white/10" />
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -bottom-8 -left-8 industrial-card p-10 w-80 space-y-4 border-l-4 border-l-industrial-emerald shadow-2xl"
          >
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">
              <span>Network Status</span>
              <ShieldCheck className={`w-4 h-4 ${account && isSepolia ? 'text-industrial-emerald' : 'text-industrial-gray-500'}`} />
            </div>
            <div className={`text-xl font-black uppercase italic ${account && isSepolia ? 'text-industrial-emerald' : 'text-black'}`}>
              {account && isSepolia ? "Sepolia Active" : account ? "Switch to Sepolia" : "Mainnet Active"}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <h2 className="heading-lg max-w-sm leading-none">
            Core Forge Modules
          </h2>
          <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">
            01 / 04 <br />
            <span className="text-black">Industrial Utility</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black p-12 text-white flex flex-col justify-between aspect-video relative overflow-hidden group">
            <div className="absolute top-8 right-8 text-[10px] font-black opacity-40 border border-white/20 px-2 py-1">V2.4 LATEST</div>
            <div className="space-y-6 relative z-10">
              <Cpu className="w-12 h-12 text-industrial-emerald" />
              <h3 className="text-8xl font-black italic uppercase tracking-tighter">ERC-20</h3>
              <p className="text-white/40 max-w-md text-sm font-medium">
                The gold standard of digital assets. Fully compliant, optimized for low-gas deployment.
              </p>
            </div>
            <div className="flex justify-between items-center mt-12 relative z-10">
              <Link 
                href="/wizard" 
                onClick={() => setIsNavigating(true)}
                className="bg-industrial-emerald text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Select Template
              </Link>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Audited by Quantstamp</div>
            </div>
          </div>

          <div className="industrial-card p-12 flex flex-col justify-between">
            <div className="space-y-8">
               <Shield className="w-8 h-8" />
               <h3 className="heading-md">Vesting <br /> Plans</h3>
               <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-industrial-gray-500 uppercase tracking-widest">Linear Unlock</div>
                    <div className="text-sm font-bold">Standard 12-48 Months</div>
                  </div>
                  <div className="h-px bg-industrial-gray-200" />
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-industrial-gray-500 uppercase tracking-widest">Cliffs</div>
                    <div className="text-sm font-bold">Custom Duration Anchors</div>
                  </div>
               </div>
            </div>
            <button className="industrial-button-secondary w-full text-[10px]">
              Configure Schedule
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
