"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Wallet, 
  Lock, 
  ArrowUpRight, 
  Download, 
  Activity, 
  Fingerprint, 
  Flame,
  Clock,
  Globe,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function ClaimPage() {
  const [claiming, setClaiming] = useState(null);

  const mockClaim = async (id) => {
    setClaiming(id);
    // Mock ethers transaction delay
    await new Promise(r => setTimeout(r, 2000));
    alert("Transaction Successful: Vested assets transferred to your industrial vault.");
    setClaiming(null);
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
        <div className="lg:col-span-2 space-y-8">
          <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Portal / Vesting</div>
          <h1 className="text-8xl font-black tracking-tighter leading-[0.9]">
            Claim Your <br />
            Vested Assets.
          </h1>
          <p className="text-industrial-gray-500 font-medium max-w-xl text-lg leading-relaxed">
            Secure institutional-grade asset distribution. Review your vesting schedule, track unlock milestones, 
            and claim your tokens directly to your verified industrial vault.
          </p>
        </div>

        <div className="bg-industrial-gray-100 p-12 aspect-[4/3] flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden group">
           <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500 relative z-10">Network Status</div>
           <div className="flex items-center gap-3 text-2xl font-black uppercase italic relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-industrial-emerald" />
              Mainnet Active
           </div>
           <Globe className="absolute -bottom-12 -right-12 w-48 h-48 text-black/5 group-hover:rotate-12 transition-transform duration-1000" />
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="industrial-card p-12 space-y-24 flex flex-col justify-between">
            <div className="space-y-4">
               <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Available Now</div>
               <div className="text-6xl font-black tracking-tighter text-industrial-emerald leading-none">42,000 <span className="text-lg">DCT</span></div>
            </div>
            <button 
              onClick={() => mockClaim('all')}
              disabled={claiming === 'all'}
              className="industrial-button-primary w-full text-xs flex items-center justify-center gap-2"
            >
              {claiming === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim All Assets"}
            </button>
         </div>

         <div className="industrial-card p-12 space-y-24 bg-industrial-gray-100/50 flex flex-col justify-between">
            <div className="space-y-4">
               <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Locked Balance</div>
               <div className="text-6xl font-black tracking-tighter text-industrial-crimson leading-none">158,000 <span className="text-lg">DCT</span></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-industrial-crimson">
               <Lock className="w-4 h-4" />
               Next Unlock: 14 Days
            </div>
         </div>

         <div className="bg-black p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20" />
            <h3 className="heading-md relative z-10 leading-tight">Institutional <br /> Grade Security</h3>
            <p className="text-xs text-white/40 font-medium relative z-10 leading-relaxed">
              Every claim transaction is audited by decentralized verification protocols.
            </p>
         </div>
      </section>

      {/* Distribution Schedule */}
      <section className="space-y-8">
         <div className="flex justify-between items-end">
            <h2 className="heading-md leading-none">Asset Distribution Schedule</h2>
            <button 
              onClick={() => alert("Generating Secure Audit Report...")}
              className="industrial-button-secondary py-2 text-[8px]"
            >
              Export Report
            </button>
         </div>

         <div className="industrial-card overflow-hidden">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-industrial-gray-100">
                   <th className="px-8 py-6 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Vesting Contract</th>
                   <th className="px-8 py-6 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Total Granted</th>
                   <th className="px-8 py-6 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Claimed</th>
                   <th className="px-8 py-6 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Unlocked</th>
                   <th className="px-8 py-6 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Status</th>
                   <th className="px-8 py-6 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-industrial-gray-100">
                  {[
                    { name: "FOUNDER_ALLOC_Q1", addr: "0X414...F5B1", total: "100,000 DCT", claimed: "25,000 DCT", unlocked: "75,000 DCT", status: "FULLY UNLOCKED", color: "text-industrial-emerald", bg: "bg-industrial-emerald" },
                    { name: "STRATEGIC_SERIES_A", addr: "0XA11...B92C", total: "50,000 DCT", claimed: "0 DCT", unlocked: "0 DCT", status: "CLIFF PERIOD", color: "text-industrial-crimson", bg: "bg-industrial-crimson" },
                    { name: "COMMUNITY_REWARDS", addr: "0XDB...B1B4", total: "12,000 DCT", claimed: "5,000 DCT", unlocked: "7,000 DCT", status: "PARTIAL UNLOCK", color: "text-industrial-cyan", bg: "bg-industrial-cyan" },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-industrial-gray-50 transition-colors">
                      <td className="px-8 py-8">
                         <div className="font-black text-sm uppercase tracking-tight">{row.name}</div>
                         <div className="text-[9px] font-bold text-industrial-gray-500 uppercase tracking-widest">{row.addr}</div>
                      </td>
                      <td className="px-8 py-8 font-bold text-sm">{row.total}</td>
                      <td className="px-8 py-8 font-bold text-sm text-industrial-gray-500">{row.claimed}</td>
                      <td className={`px-8 py-8 font-bold text-sm ${row.color}`}>{row.unlocked}</td>
                      <td className="px-8 py-8">
                         <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${row.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${row.bg}`} />
                            {row.status}
                         </div>
                      </td>
                      <td className="px-8 py-8">
                         {row.status === "CLIFF PERIOD" ? (
                           <button className="industrial-button-secondary py-2 text-[8px] w-full opacity-50 cursor-not-allowed">Locked</button>
                         ) : (
                           <button 
                             onClick={() => mockClaim(row.name)}
                             disabled={claiming === row.name}
                             className="industrial-button-primary py-2 text-[8px] w-full flex items-center justify-center gap-2"
                           >
                             {claiming === row.name ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim"}
                           </button>
                         )}
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Footer Details */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-16 border-t border-industrial-gray-200">
         <div className="industrial-card p-12 space-y-12">
            <h3 className="heading-md">Claim Verification</h3>
            <div className="space-y-8">
               <div className="flex gap-6">
                  <Fingerprint className="w-6 h-6 text-industrial-gray-500" />
                  <div className="space-y-1">
                     <div className="text-xs font-black uppercase tracking-tight">Identity Verified</div>
                     <p className="text-[10px] text-industrial-gray-500 font-medium">Your wallet 0x4f...E921 has been cleared for Tier 1 asset distribution.</p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <Flame className="w-6 h-6 text-industrial-gray-500" />
                  <div className="space-y-1">
                     <div className="text-xs font-black uppercase tracking-tight">Gas Fee Optimization</div>
                     <p className="text-[10px] text-industrial-gray-500 font-medium">Bundling claims can save up to 45% in network processing fees.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="industrial-card p-12 space-y-12">
            <div className="flex justify-between items-end">
               <h3 className="heading-md">Recent Activities</h3>
               <button className="text-[8px] font-black uppercase tracking-widest text-industrial-gray-500 hover:text-black">View All</button>
            </div>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-6">
                     <div className="w-10 h-10 bg-industrial-emerald/10 flex items-center justify-center text-industrial-emerald group-hover:bg-industrial-emerald group-hover:text-black transition-all">
                        <ArrowUpRight className="w-5 h-5" />
                     </div>
                     <div className="space-y-1">
                        <div className="text-xs font-black uppercase tracking-tight">Claim Successful</div>
                        <div className="text-[9px] text-industrial-gray-500 font-bold uppercase tracking-widest">Oct 24, 2023 • 14:32 UTC</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs font-black">+ 12,500.00 DCT</div>
                     <div className="text-[8px] font-black text-industrial-emerald uppercase tracking-widest">Completed</div>
                  </div>
               </div>

               <div className="h-px bg-industrial-gray-100" />

               <div className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-6">
                     <div className="w-10 h-10 bg-industrial-gray-100 flex items-center justify-center text-industrial-gray-500 group-hover:bg-black group-hover:text-white transition-all">
                        <Clock className="w-5 h-5" />
                     </div>
                     <div className="space-y-1">
                        <div className="text-xs font-black uppercase tracking-tight">Vesting Milestone Reached</div>
                        <div className="text-[9px] text-industrial-gray-500 font-bold uppercase tracking-widest">Oct 01, 2023 • 00:01 UTC</div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs font-black">42,000.00 DCT</div>
                     <div className="text-[8px] font-black text-industrial-gray-500 uppercase tracking-widest">Unlocked</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
