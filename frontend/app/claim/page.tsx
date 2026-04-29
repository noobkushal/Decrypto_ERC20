"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import { Loader2, Gift, ArrowRight, ShieldCheck, ExternalLink, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VESTING_ABI = [
    "function beneficiary() view returns (address)",
    "function start() view returns (uint256)",
    "function duration() view returns (uint256)",
    "function released() view returns (uint256)",
    "function released(address token) view returns (uint256)",
    "function vestedAmount(uint64 timestamp) view returns (uint256)",
    "function vestedAmount(address token, uint64 timestamp) view returns (uint256)",
    "function release()",
    "function release(address token)"
];

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)"
];

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ClaimContent() {
  const { account, connectWallet } = useWallet();
  const searchParams = useSearchParams();
  const [vestingAddress, setVestingAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [vestingInfo, setVestingInfo] = useState<any>(null);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const v = searchParams.get("vesting");
    const t = searchParams.get("token");
    if (v) setVestingAddress(v);
    if (t) setTokenAddress(t);
  }, [searchParams]);

  const fetchVestingInfo = async () => {
    if (!ethers.isAddress(vestingAddress)) {
      setStatus({ type: "error", message: "Invalid vesting contract address" });
      return;
    }

    setLoading(true);
    setStatus({ type: "info", message: "Scanning vault parameters..." });
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(vestingAddress, VESTING_ABI, provider);
      
      const [beneficiary, start, duration] = await Promise.all([
        contract.beneficiary(),
        contract.start(),
        contract.duration()
      ]);

      setVestingInfo({
        beneficiary,
        start: Number(start),
        duration: Number(duration),
        contractAddress: vestingAddress
      });
      
      setStatus({ type: "success", message: "Vault parameters retrieved successfully." });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to fetch vesting info. Ensure address is correct." });
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!account) return connectWallet();
    if (!tokenAddress) {
        setStatus({ type: "error", message: "Please provide the Token Address to claim." });
        return;
    }

    setLoading(true);
    setStatus({ type: "info", message: "Initiating release sequence..." });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(vestingAddress, VESTING_ABI, signer);

      const tx = await contract["release(address)"](tokenAddress);
      setStatus({ type: "info", message: "Transaction broadcasting..." });
      await tx.wait();

      setStatus({ type: "success", message: "Tokens successfully released to beneficiary vault." });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", message: err.reason || err.message || "Claim failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 page-fade-in">
      <header className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Asset Retrieval</div>
        <h1 className="heading-lg">Claim Portal</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="industrial-card p-10 space-y-8">
           <div className="space-y-4">
              <h2 className="heading-md">Vault Access</h2>
              <p className="text-xs text-industrial-gray-500 font-medium leading-relaxed">
                Enter the address of the vesting contract where your tokens are locked. This contract was generated during the Forge process.
              </p>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Vesting Contract Address</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={vestingAddress}
                        onChange={(e) => setVestingAddress(e.target.value)}
                        placeholder="0x..." 
                        className="industrial-input pr-12" 
                    />
                    <button 
                        onClick={fetchVestingInfo}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-industrial-gray-500 hover:text-black transition-colors"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Token Contract Address</label>
                <input 
                    type="text" 
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="0x..." 
                    className="industrial-input" 
                />
              </div>
           </div>

           <button 
                onClick={handleClaim}
                disabled={loading || !vestingInfo}
                className="industrial-button-primary w-full flex items-center justify-center gap-4 py-6"
           >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Gift className="w-5 h-5" /> Claim Vested Tokens</>}
           </button>
        </div>

        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {vestingInfo ? (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="industrial-card p-8 space-y-8 border-l-4 border-l-industrial-emerald"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Vault Details</div>
                            <ShieldCheck className="w-4 h-4 text-industrial-emerald" />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <div className="text-[8px] font-black text-industrial-gray-500 uppercase tracking-widest">Beneficiary Address</div>
                                <div className="text-xs font-mono font-bold break-all">{vestingInfo.beneficiary}</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-industrial-gray-500 uppercase tracking-widest">Start Date</div>
                                    <div className="text-xs font-bold uppercase">{new Date(vestingInfo.start * 1000).toLocaleDateString()}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-industrial-gray-500 uppercase tracking-widest">Duration</div>
                                    <div className="text-xs font-bold uppercase">{Math.floor(vestingInfo.duration / 86400)} Days</div>
                                </div>
                            </div>

                            <div className="p-4 bg-industrial-gray-50 border border-industrial-gray-100 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-black text-industrial-gray-500 uppercase tracking-widest">Eligibility Status</span>
                                    <span className="text-[10px] font-black uppercase text-industrial-emerald">Active</span>
                                </div>
                                <p className="text-[10px] font-medium text-industrial-gray-500 leading-tight">
                                    This vault is correctly identified. You can claim any tokens that have vested according to the linear schedule.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="industrial-card p-12 flex flex-col items-center justify-center text-center space-y-6 opacity-40 grayscale">
                        <Search className="w-12 h-12 text-industrial-gray-300" />
                        <div className="space-y-2">
                            <h3 className="text-xs font-black uppercase tracking-widest">Awaiting Input</h3>
                            <p className="text-[10px] font-medium max-w-[200px]">Connect your vesting vault to view distribution metrics.</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {status.message && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 border text-[10px] font-black uppercase tracking-widest flex items-center gap-4 ${
                        status.type === "error" ? "bg-industrial-crimson/10 border-industrial-crimson/20 text-industrial-crimson" : "bg-industrial-emerald/10 border-industrial-emerald/20 text-industrial-emerald"
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${status.type === "error" ? "bg-industrial-crimson" : "bg-industrial-emerald"} animate-pulse`} />
                    {status.message}
                </motion.div>
            )}

            <div className="bg-black p-8 text-white space-y-4">
                <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-industrial-emerald" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Etherscan Verification</span>
                </div>
                <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                    Always verify the contract source code on Etherscan before interacting with claim functions. Decrypto Forge contracts are pre-verified for your safety.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ClaimContent />
        </Suspense>
    );
}
