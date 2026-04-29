"use client";

import { motion } from "framer-motion";
import NetworkSettings from "@/components/NetworkSettings";
import { Settings, Info, Bell, Shield, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-16 pb-24 page-fade-in">
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-industrial-gray-500 font-black uppercase tracking-widest text-[10px]">
          <Settings className="w-3 h-3" />
          Terminal Configuration
        </div>
        <h1 className="heading-xl leading-none">System <br /> Parameters.</h1>
        <p className="text-industrial-gray-500 font-medium max-w-2xl text-lg">
          Configure your industrial environment, network endpoints, and application-wide default protocols.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <NetworkSettings />
          
          <section className="industrial-card p-12 space-y-8">
            <div className="flex items-center gap-4 text-industrial-gray-500">
               <Bell className="w-5 h-5" />
               <h2 className="heading-md">Notifications</h2>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <div className="text-sm font-bold uppercase">Transaction Status Alerts</div>
                     <div className="text-[10px] text-industrial-gray-500 uppercase">Notify when a block is confirmed on-chain</div>
                  </div>
                  <div className="w-12 h-6 bg-industrial-emerald rounded-full relative p-1 cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                  </div>
               </div>
               <div className="h-px bg-industrial-gray-100" />
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <div className="text-sm font-bold uppercase">Critical Security Alerts</div>
                     <div className="text-[10px] text-industrial-gray-500 uppercase">Emergency updates regarding contract vulnerabilities</div>
                  </div>
                  <div className="w-12 h-6 bg-industrial-gray-200 rounded-full relative p-1 cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="industrial-card p-8 bg-black text-white space-y-6">
             <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-industrial-emerald" />
                <span className="text-[10px] font-black uppercase tracking-widest text-industrial-emerald">Active Profile</span>
             </div>
             <div className="space-y-2">
                <div className="text-2xl font-black italic uppercase tracking-tighter">Forge Agent #01</div>
                <div className="text-[9px] font-mono text-white/40 uppercase">Access Level: Administrative</div>
             </div>
             <button className="industrial-button-secondary w-full border-white/20 text-white hover:bg-white/10 text-[10px]">
                Switch Agent
             </button>
          </div>

          <div className="industrial-card p-8 space-y-4">
             <div className="flex items-center gap-3 text-industrial-gray-500">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Environment Info</span>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase">
                   <span className="text-industrial-gray-400 font-bold">App Version</span>
                   <span className="font-black">2.4.0-Stable</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase">
                   <span className="text-industrial-gray-400 font-bold">Node Identity</span>
                   <span className="font-black">Mainframe-01</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase">
                   <span className="text-industrial-gray-400 font-bold">Uptime</span>
                   <span className="font-black text-industrial-emerald">99.9%</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
