"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { WIZARD_FACTORY_ABI, WIZARD_FACTORY_ADDRESS } from "@/lib/constants";
import { useWallet } from "@/context/WalletContext";
import { Rocket, Wallet, Loader2, Zap, ArrowLeft, ArrowRight, ShieldCheck, PenLine, Plus, Terminal, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeployPage() {
  const { account, connectWallet, systemConfig } = useWallet();
  const [useSystemSigner, setUseSystemSigner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState({ type: "", message: "" });
  
  const [formData, setFormData] = useState({
    name: "Industrial Protocol",
    symbol: "INDS",
    supply: "100000000",
    decimals: "18",
    cliff: "3600",
    duration: "86400",
  });

  const [allocations, setAllocations] = useState([
    { address: account || "", weight: "100", name: "Founder Allocation" }
  ]);

  useEffect(() => {
    if (account && allocations.length === 1 && allocations[0].address === "") {
        setAllocations([{ ...allocations[0], address: account }]);
    }
  }, [account]);

  const addAllocation = () => {
    setAllocations([...allocations, { address: "", weight: "0", name: "New Allocation" }]);
  };

  const removeAllocation = (index: number) => {
    if (allocations.length > 1) {
        const newAllocations = [...allocations];
        newAllocations.splice(index, 1);
        setAllocations(newAllocations);
    }
  };

  const updateAllocation = (index: number, field: string, value: string) => {
    const newAllocations = [...allocations];
    (newAllocations[index] as any)[field] = value;
    setAllocations(newAllocations);
  };

  const handleDeploy = async () => {
    if (!account) return connectWallet();
    
    setLoading(true);
    setStatus({ type: "info", message: "Initializing deployment sequence..." });

    try {
      let signer;
      if (useSystemSigner) {
        if (!systemConfig.rpcUrl) throw new Error("System RPC URL not configured.");
        const provider = new ethers.JsonRpcProvider(systemConfig.rpcUrl);
        const configRes = await fetch("/api/config");
        const configData = await configRes.json();
        if (!configData.privateKey) throw new Error("Private Key not configured.");
        signer = new ethers.Wallet(configData.privateKey, provider);
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }

      const factory = new ethers.Contract(WIZARD_FACTORY_ADDRESS, WIZARD_FACTORY_ABI, signer);

      const beneficiaries = allocations.map(a => a.address);
      const weights = allocations.map(a => BigInt(a.weight));

      const tx = await factory.deployWizard(
        formData.name,
        formData.symbol,
        ethers.parseUnits(formData.supply, 18),
        beneficiaries,
        weights,
        parseInt(formData.cliff),
        parseInt(formData.duration)
      );

      setStatus({ type: "info", message: "Transaction pending..." });
      const receipt = await tx.wait();

      const event = receipt.logs.find((log: any) => {
        try {
          return factory.interface.parseLog(log)?.name === "WizardDeployed";
        } catch (e) { return false; }
      });

      if (event) {
        const decoded = factory.interface.parseLog(event);
        const { tokenAddress, vestingAddresses, startTimestamp } = decoded.args;

        await addDoc(collection(db, "deployments"), {
          tokenName: formData.name,
          tokenSymbol: formData.symbol,
          tokenAddress,
          vestingAddresses,
          founder: account,
          initialSupply: formData.supply,
          cliff: formData.cliff,
          duration: formData.duration,
          startTimestamp: startTimestamp.toString(),
          timestamp: serverTimestamp(),
          txHash: tx.hash,
          allocations: allocations.map((a, i) => ({ ...a, vestingAddress: vestingAddresses[i] })),
          constructorArgs: {
            token: [formData.name, formData.symbol, "0", WIZARD_FACTORY_ADDRESS, WIZARD_FACTORY_ADDRESS],
            vestings: allocations.map((a, i) => [a.address, startTimestamp.toString(), formData.cliff, formData.duration])
          }
        });



        setStatus({ type: "success", message: `Forge successful. Asset: ${tokenAddress?.slice(0, 8)}...` });
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", message: err.reason || err.message || "Deployment failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 page-fade-in">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Asset Generation</div>
          <h1 className="heading-lg">Forge Wizard</h1>
        </div>
        
        <div className="flex gap-12">
          {["Parameters", "Distribution", "Review"].map((s, i) => (
             <button 
               key={s} 
               onClick={() => setStep(i + 1)}
               className="flex flex-col gap-1 text-left group transition-all"
             >
                <div className={`text-[10px] font-black uppercase tracking-widest ${step === i + 1 ? 'text-black' : 'text-industrial-gray-500 group-hover:text-black'}`}>
                   0{i + 1}. {s}
                </div>
                <div className={`h-1 w-48 ${step === i + 1 ? 'bg-black' : 'bg-industrial-gray-200 group-hover:bg-industrial-gray-400'}`} />
             </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.section 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="heading-md">Core Identity</h2>
                  <p className="text-xs text-industrial-gray-500 font-medium">Define the foundational properties of your smart contract asset.</p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Asset Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="industrial-input" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Ticker Symbol</label>
                      <input 
                        type="text" 
                        value={formData.symbol}
                        onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                        className="industrial-input" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Total Supply</label>
                      <input 
                        type="text" 
                        value={formData.supply}
                        onChange={(e) => setFormData({...formData, supply: e.target.value})}
                        className="industrial-input" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Decimals</label>
                      <input 
                        type="text" 
                        value="18" 
                        disabled
                        className="industrial-input opacity-50" 
                      />
                   </div>
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="heading-md">Distribution Metrics</h2>
                  <p className="text-xs text-industrial-gray-500 font-medium">Configure recipient allocations and vesting anchors.</p>
                </div>

                <div className="space-y-4">
                  {allocations.map((alloc, idx) => (
                    <div key={idx} className="industrial-card p-6 space-y-4 group relative">
                       <button 
                            onClick={() => removeAllocation(idx)}
                            className="absolute top-4 right-4 text-industrial-gray-300 hover:text-industrial-crimson transition-colors"
                       >
                            <Trash2 className="w-4 h-4" />
                       </button>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Allocation Name</label>
                            <input 
                                type="text" 
                                value={alloc.name}
                                onChange={(e) => updateAllocation(idx, "name", e.target.value)}
                                className="industrial-input text-xs" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Weight / Pct</label>
                            <input 
                                type="text" 
                                value={alloc.weight}
                                onChange={(e) => updateAllocation(idx, "weight", e.target.value)}
                                className="industrial-input text-xs" 
                            />
                          </div>
                       </div>
                       <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-widest text-industrial-gray-500">Beneficiary Address</label>
                            <input 
                                type="text" 
                                value={alloc.address}
                                onChange={(e) => updateAllocation(idx, "address", e.target.value)}
                                placeholder="0x..."
                                className="industrial-input text-xs font-mono" 
                            />
                       </div>
                    </div>
                  ))}

                  <button 
                    onClick={addAllocation}
                    className="w-full border-2 border-dashed border-industrial-gray-200 p-6 flex items-center justify-center gap-3 text-industrial-gray-500 hover:border-black hover:text-black transition-all uppercase font-black text-[10px] tracking-widest"
                  >
                     <Plus className="w-4 h-4" />
                     Add Recipient
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Cliff Duration (Seconds)</label>
                        <input 
                            type="text" 
                            value={formData.cliff}
                            onChange={(e) => setFormData({...formData, cliff: e.target.value})}
                            className="industrial-input" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Total Vesting Duration (Seconds)</label>
                        <input 
                            type="text" 
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            className="industrial-input" 
                        />
                    </div>
                </div>
              </motion.section>
            )}

            {step === 3 && (
              <motion.section 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="heading-md">Final Review</h2>
                  <p className="text-xs text-industrial-gray-500 font-medium">Verify the parameters before broadcasting to the Ethereum mainnet.</p>
                </div>

                <div className="industrial-card p-10 space-y-12">
                    <div className="grid grid-cols-2 gap-12 border-b border-industrial-gray-100 pb-12">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-industrial-gray-500 uppercase tracking-widest">Asset Target</div>
                            <div className="text-2xl font-black italic uppercase tracking-tighter">{formData.name} ({formData.symbol})</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-industrial-gray-500 uppercase tracking-widest">Total Issuance</div>
                            <div className="text-2xl font-black italic uppercase tracking-tighter">{formData.supply} Tokens</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="text-[10px] font-black text-industrial-gray-500 uppercase tracking-widest">Allocation Matrix</div>
                        <div className="space-y-3">
                            {allocations.map((a, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                                    <span>{a.name || "Recipient"}</span>
                                    <span className="font-mono text-industrial-gray-500">{a.address.slice(0, 6)}...{a.address.slice(-4)}</span>
                                    <span>{a.weight} Weight</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="pt-12 border-t border-industrial-gray-200 flex justify-between items-center">
             <button 
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-industrial-gray-500 hover:text-black'}`}
             >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
             </button>
             
             {!account ? (
               <button 
                  onClick={connectWallet}
                  className="industrial-button-primary flex items-center gap-4 px-12"
               >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
               </button>
             ) : (
               <button 
                  onClick={() => {
                    if (step < 3) setStep(step + 1);
                    else handleDeploy();
                  }}
                  disabled={loading}
                  className="industrial-button-primary flex items-center gap-4 px-12"
               >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {step === 3 ? "Execute Forge" : "Continue Sequence"}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
               </button>
             )}
          </div>
          
          <AnimatePresence>
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
          </AnimatePresence>
        </div>

        <aside className="space-y-8">
           <div className="industrial-card p-8 space-y-6 border-l-4 border-l-industrial-emerald bg-industrial-emerald/5">
              <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Broadcast Vector</div>
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => setUseSystemSigner(false)}
                   className={`flex items-center justify-between p-4 border transition-all ${!useSystemSigner ? 'bg-white border-black shadow-sm' : 'border-industrial-gray-200 text-industrial-gray-400'}`}
                 >
                    <div className="flex items-center gap-3">
                       <Wallet className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-tight">Metamask</span>
                    </div>
                    {!useSystemSigner && <CheckCircle2 className="w-3 h-3 text-industrial-emerald" />}
                 </button>
              </div>
           </div>

           <div className="industrial-card p-8 space-y-8 border-2 border-black/5">
              <div className="flex justify-between items-center">
                 <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Asset Preview</div>
                 <div className="bg-industrial-emerald/20 text-industrial-emerald px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">Active Draft</div>
              </div>

              <div className="aspect-video bg-black p-8 text-white flex flex-col justify-end relative overflow-hidden">
                 <div className="space-y-1 relative z-10">
                    <div className="text-4xl font-black italic uppercase tracking-tighter leading-none">{formData.symbol || "INDS"}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{formData.name || "Industrial Protocol"}</div>
                 </div>
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap className="w-24 h-24" />
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <div className="flex justify-between items-center border-b border-industrial-gray-100 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Protocol</span>
                    <span className="text-xs font-bold uppercase tracking-tight">ERC-20 + Multi-Vesting</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Network</span>
                    <span className="text-xs font-bold uppercase tracking-tight text-industrial-emerald">Sepolia Testnet</span>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
