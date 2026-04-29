"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Lock, Globe, Loader2, CheckCircle2 } from "lucide-react";

export default function NetworkSettings() {
  const [config, setConfig] = useState({ rpcUrl: "", privateKey: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setStatus("Configuration Updated Successfully");
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-industrial-gray-500" />;

  return (
    <section className="industrial-card p-12 space-y-12 bg-white border-2 border-black">
      <div className="flex justify-between items-center border-b border-industrial-gray-100 pb-8">
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">System Parameters</div>
          <h2 className="heading-md">Network & Signer</h2>
        </div>
        <Settings className="w-8 h-8 text-industrial-gray-200" />
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">
            <Globe className="w-3 h-3" />
            Sepolia RPC Endpoint
          </label>
          <input 
            type="text" 
            value={config.rpcUrl}
            onChange={(e) => setConfig({...config, rpcUrl: e.target.value})}
            placeholder="https://eth-sepolia.g.alchemy.com/v2/..."
            className="industrial-input font-mono text-xs" 
          />
          <p className="text-[9px] font-medium text-industrial-gray-400 italic">
            Recommended: Alchemy, Infura, or Ankr dedicated endpoints.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">
            <Lock className="w-3 h-3" />
            Developer Private Key (Local Only)
          </label>
          <div className="relative">
             <input 
               type="password" 
               value={config.privateKey}
               onChange={(e) => setConfig({...config, privateKey: e.target.value})}
               placeholder="0x..." 
               className="industrial-input font-mono text-xs pr-12" 
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Lock className="w-4 h-4 text-industrial-gray-200" />
             </div>
          </div>
          <div className="p-4 bg-industrial-crimson/5 border border-industrial-crimson/20 rounded flex gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-industrial-crimson mt-1" />
             <p className="text-[9px] font-bold text-industrial-crimson uppercase tracking-tight leading-relaxed">
               WARNING: This key is used for server-side signing. Never use a mainnet key or commit your .env file.
             </p>
          </div>
        </div>

        <div className="h-px bg-industrial-gray-100 my-8" />

        <div className="space-y-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">Application Preferences</div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-industrial-gray-400">Default Token Name</label>
              <input type="text" placeholder="e.g. Industrial Asset" className="industrial-input text-xs" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-industrial-gray-400">Default Symbol</label>
              <input type="text" placeholder="e.g. IND" className="industrial-input text-xs" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-industrial-gray-400">Default Total Supply</label>
            <input type="number" placeholder="1000000" className="industrial-input text-xs" />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-industrial-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-industrial-emerald text-[10px] font-black uppercase">
          {status && <><CheckCircle2 className="w-4 h-4" /> {status}</>}
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="industrial-button-primary flex items-center gap-3 px-12"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Sync Configuration</>}
        </button>
      </div>
    </section>
  );
}
