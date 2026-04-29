"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { WIZARD_FACTORY_ADDRESS, WIZARD_FACTORY_ABI } from "@/lib/constants";
import { Rocket, Wallet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeployForm() {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  
  const [formData, setFormData] = useState({
    name: "Villain Token",
    symbol: "VLN",
    supply: "1000000",
    beneficiary: "",
    cliff: "3600", // 1 hour
    duration: "86400", // 1 day
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus({ type: "error", message: "Metamask not detected" });
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setFormData(prev => ({ ...prev, beneficiary: accounts[0] }));
    } catch (err) {
      setStatus({ type: "error", message: "Failed to connect wallet" });
    }
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!account) return connectWallet();
    
    setLoading(true);
    setStatus({ type: "info", message: "Initializing deployment sequence..." });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(WIZARD_FACTORY_ADDRESS, WIZARD_FACTORY_ABI, signer);

      const tx = await factory.deployWizard(
        formData.name,
        formData.symbol,
        ethers.parseEther(formData.supply),
        [formData.beneficiary],
        [100], // Default 100% weight for single beneficiary
        parseInt(formData.cliff),
        parseInt(formData.duration)
      );

      setStatus({ type: "info", message: "Transaction Sent! Waiting for block confirmation..." });
      console.log("TX Hash:", tx.hash);
      const receipt = await tx.wait();
      setStatus({ type: "info", message: "Transaction Confirmed! Processing event data..." });

      // Extract addresses from logs
      // The event is WizardDeployed(founder, tokenAddress, vestingAddress, ...)
      const event = receipt.logs.find(log => {
        try {
          return factory.interface.parseLog(log)?.name === "WizardDeployed";
        } catch (e) { return false; }
      });

      if (event) {
        const decoded = factory.interface.parseLog(event);
        const { tokenAddress, vestingAddresses } = decoded.args;

        // Save to Firestore
        await addDoc(collection(db, "deployments"), {
          tokenName: formData.name,
          tokenSymbol: formData.symbol,
          tokenAddress,
          vestingAddresses,
          founder: account,
          beneficiary: formData.beneficiary,
          initialSupply: formData.supply,
          cliff: formData.cliff,
          duration: formData.duration,
          timestamp: serverTimestamp(),
          txHash: tx.hash
        });

        setStatus({ 
          type: "success", 
          message: `Deployment Successful! Token: ${tokenAddress.slice(0, 6)}...` 
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.reason || err.message || "Deployment failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-crimson to-transparent opacity-50" />
        
        <header className="mb-8">
          <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic text-neon-crimson">Deploy New Asset</h2>
          <p className="text-white/50 text-sm font-medium">Configure your token and vesting parameters for maximum dominance.</p>
        </header>

        {!account ? (
          <button 
            onClick={connectWallet}
            className="w-full py-4 rounded-xl bg-neon-crimson text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,0,60,0.3)]"
          >
            <Wallet className="w-5 h-5" />
            Establish Connection
          </button>
        ) : (
          <form onSubmit={handleDeploy} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Token Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-crimson transition-colors"
                  placeholder="e.g. Chaos Coin"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Symbol</label>
                <input 
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-crimson transition-colors"
                  placeholder="e.g. CHS"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Initial Supply</label>
              <input 
                type="number"
                value={formData.supply}
                onChange={(e) => setFormData({...formData, supply: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-emerald transition-colors"
                placeholder="1000000"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Beneficiary Address</label>
              <input 
                type="text"
                value={formData.beneficiary}
                onChange={(e) => setFormData({...formData, beneficiary: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-cyan transition-colors font-mono"
                placeholder="0x..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Cliff (Seconds)</label>
                <input 
                  type="number"
                  value={formData.cliff}
                  onChange={(e) => setFormData({...formData, cliff: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Duration (Seconds)</label>
                <input 
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest hover:bg-neon-emerald hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />}
              {loading ? "Executing..." : "Initiate Deployment"}
            </button>
          </form>
        )}

        <AnimatePresence>
          {status.message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${
                status.type === "error" ? "bg-neon-crimson/10 border-neon-crimson/20 text-neon-crimson" :
                status.type === "success" ? "bg-neon-emerald/10 border-neon-emerald/20 text-neon-emerald" :
                "bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan"
              }`}
            >
              {status.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              <span className="text-xs font-bold uppercase tracking-wider">{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {account && (
        <div className="mt-6 flex items-center justify-between px-6 py-3 glass rounded-2xl border border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Active Agent</span>
          <span className="text-[10px] font-mono text-neon-emerald uppercase">{account}</span>
        </div>
      )}
    </motion.div>
  );
}
