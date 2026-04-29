"use client";

import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";

export default function ForgeAnimation() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none"
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Glowing Orbitals */}
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 rounded-full border-2 border-dashed border-neon-crimson/30"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-48 h-48 rounded-full border-2 border-dotted border-neon-emerald/30 scale-75"
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-16 h-16 text-neon-crimson fill-neon-crimson drop-shadow-[0_0_15px_rgba(255,0,60,0.8)]" />
            </motion.div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">Forging <span className="text-neon-crimson">Asset</span></h3>
          <div className="flex items-center justify-center gap-2 text-neon-emerald font-mono text-[10px] uppercase tracking-[0.4em]">
            <Loader2 className="w-3 h-3 animate-spin" />
            Synchronizing with the Void
          </div>
        </div>

        {/* Cinematic Scanline */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-px bg-white/20 blur-sm shadow-[0_0_10px_white]"
        />
      </div>
    </motion.div>
  );
}
