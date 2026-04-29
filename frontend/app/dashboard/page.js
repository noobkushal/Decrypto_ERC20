"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Plus, 
  Filter, 
  Download, 
  ExternalLink,
  ChevronRight,
  Database,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { ethers } from "ethers";
import Link from "next/link";
import NetworkSettings from "@/components/NetworkSettings";

export default function ArchivePage() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockNumber, setBlockNumber] = useState("SYNCING...");
  const [activeTab, setActiveTab] = useState("overview");
  const [verifyingId, setVerifyingId] = useState(null);
  const fetchCount = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const fetchBlock = async () => {
      if (fetchCount.current > 0) return;
      fetchCount.current++;

      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia", undefined, { staticNetwork: true });
        const block = await provider.getBlockNumber();
        if (isMounted) setBlockNumber(`#${block.toLocaleString()}`);
      } catch (e) {
        if (isMounted) setBlockNumber("OFFLINE");
      } finally {
        fetchCount.current--;
      }
    };

    fetchBlock();
    const interval = setInterval(fetchBlock, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, "deployments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setDeployments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleVerify = async (deployment) => {
    setVerifyingId(deployment.id);
    
    try {
        const response = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                address: deployment.tokenAddress,
                constructorArgs: deployment.constructorArgs
            })
        });
        
        const data = await response.json();
        if (data.success) {
            await updateDoc(doc(db, "deployments", deployment.id), { verified: true });
        }
    } catch (e) {
        console.error("Verification failed:", e);
    } finally {
        setVerifyingId(null);
    }
  };


  return (
    <div className="space-y-12 pb-24 page-fade-in">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Secure Infrastructure</div>
          <h1 className="heading-lg">Vault Dashboard</h1>
        </div>
        
        <div className="flex gap-16">
           <div className="space-y-1 text-right">
              <div className="text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Total Value Locked</div>
              <div className="text-2xl font-black italic">$1,284,902</div>
           </div>
           <div className="space-y-1">
              <div className="text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">System Health</div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight text-industrial-emerald">
                 <div className="w-2 h-2 rounded-full bg-industrial-emerald animate-pulse" />
                 Operational
              </div>
           </div>
        </div>
      </header>

      <div className="flex gap-12 border-b border-industrial-gray-200">
        {["overview", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab ? "text-black border-black" : "text-industrial-gray-400 border-transparent hover:text-black"
            }`}
          >
            {tab === "overview" ? "Vault Overview" : "Signer Settings"}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="industrial-card p-8 space-y-4">
                <Database className="w-5 h-5 text-industrial-gray-500" />
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Active Vaults</div>
                   <div className="text-4xl font-black italic">{deployments.length}</div>
                </div>
             </div>
             <div className="industrial-card p-8 space-y-4">
                <Clock className="w-5 h-5 text-industrial-gray-500" />
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Uptime (Epoch)</div>
                   <div className="text-4xl font-black italic">99.9%</div>
                </div>
             </div>
             <div className="industrial-card p-8 space-y-4">
                <ShieldCheck className="w-5 h-5 text-industrial-gray-500" />
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Security Index</div>
                   <div className="text-4xl font-black italic">AAA</div>
                </div>
             </div>
             <Link href="/wizard" className="bg-black p-8 flex flex-col justify-between group hover:bg-industrial-gray-900 transition-all text-white">
                <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-40">New Forge</div>
                   <div className="text-2xl font-black italic uppercase tracking-tighter">Initiate Wizard</div>
                </div>
             </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-center">
                   <h2 className="heading-md">Recent Deployments</h2>
                   <div className="flex gap-4">
                      <button className="p-2 industrial-card border-none bg-industrial-gray-100 hover:bg-industrial-gray-200 transition-colors"><Filter className="w-4 h-4" /></button>
                      <button className="p-2 industrial-card border-none bg-industrial-gray-100 hover:bg-industrial-gray-200 transition-colors"><Download className="w-4 h-4" /></button>
                   </div>
                </div>

                <div className="industrial-card overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-industrial-gray-100">
                          <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Asset</th>
                          <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Vault Vector</th>
                          <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Status</th>
                          <th className="px-8 py-4 text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-industrial-gray-100">
                        {loading ? (
                           <tr>
                             <td colSpan={4} className="px-8 py-12 text-center">
                                <div className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-industrial-gray-500">
                                   <Loader2 className="w-4 h-4 animate-spin" />
                                   Decryption in Progress...
                                </div>
                             </td>
                           </tr>
                        ) : deployments.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-xs font-bold text-industrial-gray-500 uppercase tracking-widest">
                              No deployment logs found.
                            </td>
                          </tr>
                        ) : (
                          deployments.map((d) => (
                            <tr key={d.id} className="hover:bg-industrial-gray-50 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="font-black italic uppercase text-sm tracking-tight">{d.tokenName}</div>
                                 <div className="text-[9px] font-bold text-industrial-gray-500 uppercase">{d.tokenSymbol}</div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2 bg-black text-white px-2 py-0.5 text-[8px] font-mono font-bold w-fit">
                                       TOKEN: {d.tokenAddress?.slice(0, 8)}...
                                    </div>
                                    <div className="text-[8px] font-bold text-industrial-gray-500 uppercase">
                                       {d.vestingAddresses?.length || 1} Vesting Vaults
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 {d.verified ? (
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-industrial-emerald">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Verified
                                    </div>
                                 ) : (
                                    <button 
                                        onClick={() => handleVerify(d)}
                                        disabled={verifyingId === d.id}

                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-industrial-crimson hover:underline"
                                    >
                                        {verifyingId === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-industrial-crimson animate-pulse" />}
                                        {verifyingId === d.id ? "Verifying..." : "Verify Source"}
                                    </button>
                                 )}
                              </td>
                              <td className="px-8 py-6">
                                 <Link 
                                    href={`/claim?vesting=${d.vestingAddresses?.[0] || ""}&token=${d.tokenAddress}`}
                                    className="industrial-button-secondary text-[8px] py-1 px-3"
                                 >
                                    Open Portal
                                 </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                   </table>
                </div>
             </div>

             <aside className="space-y-8">
                <div className="industrial-card p-8 space-y-8">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Network Pulse</h3>
                   <div className="space-y-8">
                      {[
                        { title: "Block Height Sync", desc: `Connected to Sepolia. Block ${blockNumber} processed.`, time: "JUST NOW", color: "industrial-emerald" },
                        { title: "Vault Audit", desc: "Security scan completed. All smart contracts within nominal parameters.", time: "14 MINS AGO", color: "industrial-cyan" },
                        { title: "Gas Optimization", desc: "Batch processing enabled. Estimated 12% saving on next forge.", time: "2 HOURS AGO", color: "industrial-gray-500" }
                      ].map((pulse) => (
                        <div key={pulse.title} className={`flex gap-4 border-l-2 border-${pulse.color} pl-6 relative`}>
                           <div className="space-y-2">
                              <h4 className="text-xs font-black uppercase tracking-tight">{pulse.title}</h4>
                              <p className="text-[10px] text-industrial-gray-500 font-medium leading-relaxed">{pulse.desc}</p>
                              <div className="text-[8px] font-black text-industrial-gray-500">{pulse.time}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-black aspect-video relative overflow-hidden p-8 flex flex-col justify-end text-white group">
                   <div className="space-y-1 relative z-10">
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Security Protocol</div>
                      <div className="text-3xl font-black italic uppercase tracking-tighter leading-none group-hover:tracking-normal transition-all duration-700">Quantum Resistance <br /> Active</div>
                   </div>
                   <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover" />
                </div>
             </aside>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl">
          <NetworkSettings />
        </div>
      )}
    </div>
  );
}
