"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Globe, Server, Cpu, Zap, Activity, Info } from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      title: "Decentralized Infrastructure",
      desc: "Our protocol operates on Ethereum, leveraging a distributed network of thousands of nodes. This ensures that no single entity can censor your token or alter the smart contract once deployed.",
      icon: <Globe className="w-6 h-6 text-industrial-emerald" />
    },
    {
      title: "Immutable Token Standards",
      desc: "All tokens generated through the Wizard follow strict ERC-20 standards. This compatibility ensures your tokens work seamlessly with Uniswap, MetaMask, and institutional custodians.",
      icon: <Cpu className="w-6 h-6 text-industrial-emerald" />
    },
    {
      title: "Audited OpenZeppelin Core",
      desc: "We don't reinvent the wheel. Our templates use battle-tested libraries from OpenZeppelin, the industry leader in smart contract security, preventing common vulnerabilities like overflow or reentrancy.",
      icon: <ShieldCheck className="w-6 h-6 text-industrial-emerald" />
    },
    {
      title: "Built-in Vesting Security",
      desc: "Legitimate projects protect their communities. Our integrated vesting contracts ensure team and investor tokens are locked, preventing 'rugpulls' and ensuring long-term alignment.",
      icon: <Lock className="w-6 h-6 text-industrial-emerald" />
    }
  ];

  return (
    <div className="space-y-24 pb-24 page-fade-in">
      {/* Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-industrial-emerald font-black uppercase tracking-widest text-[10px]">
          <div className="w-2 h-2 rounded-full bg-industrial-emerald" />
          Security Protocols
        </div>
        <h1 className="heading-xl leading-none">Industrial <br /> Protection.</h1>
        <p className="text-industrial-gray-500 font-medium max-w-2xl text-lg">
          Decrypto Industrial ensures that every asset forged in our vault meets the highest standards of decentralized security and transparency.
        </p>
      </header>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {securityFeatures.map((feature, i) => (
          <motion.div 
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="industrial-card p-12 space-y-6 group hover:border-black transition-colors"
          >
            <div className="p-4 border border-industrial-gray-200 inline-block group-hover:bg-black group-hover:text-white transition-all">
              {feature.icon}
            </div>
            <h3 className="heading-md">{feature.title}</h3>
            <p className="text-industrial-gray-500 text-sm leading-relaxed font-medium">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Blockchain Info Section */}
      <section className="bg-black p-16 text-white space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity className="w-64 h-64" />
        </div>
        
        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="text-[10px] font-black uppercase tracking-widest text-industrial-emerald">Blockchain Intelligence</div>
          <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-tight">
            The Decentralized Ledger
          </h2>
          <p className="text-white/60 text-lg leading-relaxed font-medium">
            A blockchain is a distributed database that is shared among the nodes of a computer network. As a database, a blockchain stores information electronically in digital format. Unlike a traditional database, blockchains are decentralized, meaning no single person or group has control—rather, all users collectively retain control.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-industrial-emerald" />
                  <span className="text-xs font-black uppercase tracking-widest">Trustless Exchange</span>
               </div>
               <p className="text-white/40 text-xs leading-relaxed">
                 By using decentralized tokens, you eliminate the need for third-party intermediaries. Transactions are verified by the network, reducing costs and increasing speed.
               </p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-industrial-emerald" />
                  <span className="text-xs font-black uppercase tracking-widest">Global Availability</span>
               </div>
               <p className="text-white/40 text-xs leading-relaxed">
                 Blockchain assets are available 24/7/365. There are no "banking hours" or geographic restrictions in the decentralized economy.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Badge */}
      <div className="flex flex-col items-center justify-center py-24 space-y-8 border-t border-industrial-gray-200">
        <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Official Verification</div>
        <div className="flex gap-16 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 font-black italic text-2xl uppercase tracking-tighter">
             <ShieldCheck className="w-8 h-8" /> Quantstamp
           </div>
           <div className="flex items-center gap-2 font-black italic text-2xl uppercase tracking-tighter">
             <ShieldCheck className="w-8 h-8" /> OpenZeppelin
           </div>
           <div className="flex items-center gap-2 font-black italic text-2xl uppercase tracking-tighter">
             <ShieldCheck className="w-8 h-8" /> Trail of Bits
           </div>
        </div>
      </div>
    </div>
  );
}
