"use client";

import { motion } from "framer-motion";
import { Wallet, ShieldCheck, ArrowRight, Zap, Loader2 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { account, connectWallet, loading } = useWallet();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (account && !isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }, [account, router, isRedirecting]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 page-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-emerald/10 border border-industrial-emerald/20 text-industrial-emerald text-[9px] font-black uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Secure Access Protocol
        </div>
        <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
          Identify <br />
          <span className="text-industrial-gray-300">Your Agent</span>
        </h1>
        <p className="text-industrial-gray-500 font-medium max-w-sm mx-auto text-sm leading-relaxed">
          Establish a secure connection to the Decrypto Industrial Forge. Your wallet is your identity.
        </p>
      </div>

      <div className="w-full max-w-md">
        {account ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="industrial-card p-12 text-center space-y-6 border-industrial-emerald shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          >
            <div className="w-20 h-20 rounded-full bg-industrial-emerald/10 flex items-center justify-center mx-auto mb-8 border-2 border-industrial-emerald animate-pulse">
               <ShieldCheck className="w-10 h-10 text-industrial-emerald" />
            </div>
            <h2 className="heading-md">Connection Established</h2>
            <p className="text-[10px] font-mono text-industrial-gray-500 break-all">{account}</p>
            <div className="flex items-center justify-center gap-2 text-industrial-emerald text-[10px] font-black uppercase tracking-widest pt-4">
               <Loader2 className="w-3 h-3 animate-spin" />
               Redirecting to Sector 01
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={connectWallet}
              disabled={loading}
              className="w-full industrial-button-primary py-6 flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Wallet className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span className="text-lg">Initialize MetaMask</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform ml-auto" />
                </>
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="industrial-card p-4 flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                 <Zap className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Coinbase</span>
              </div>
              <div className="industrial-card p-4 flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                 <Zap className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">WalletConnect</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-industrial-gray-400">
        System Architecture v2.4.0-Stable
      </div>
    </div>
  );
}
