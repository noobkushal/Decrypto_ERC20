"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

export default function NetworkWrapper({ children }) {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [hasProvider, setHasProvider] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setHasProvider(true);
      
      const checkNetwork = async () => {
        try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
        } catch (e) {
            console.error(e);
        }
      };

      checkNetwork();

      window.ethereum.on("chainChanged", (chainId) => {
        setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
      });
    }
  }, []);

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Test Network",
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            }],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  if (!hasProvider) return children;

  return (
    <>
      <AnimatePresence>
        {!isCorrectNetwork && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-3xl p-6"
          >
            <div className="max-w-md w-full bg-white p-12 border-2 border-black shadow-2xl space-y-8">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-industrial-crimson">Network Mismatch</div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Access <br /> Restricted</h2>
                <p className="text-industrial-gray-500 text-xs font-medium leading-relaxed">
                    The Decrypto Forge requires a secure connection to the <span className="text-black font-bold">Ethereum Sepolia</span> testnet. Unauthorized networks are strictly prohibited from broadcasting forge sequences.
                </p>
              </div>

              <div className="pt-4">
                  <button 
                    onClick={switchToSepolia}
                    className="industrial-button-primary w-full flex items-center justify-center gap-4"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Switch to Sepolia
                  </button>
              </div>

              <div className="flex items-center gap-2 pt-8 opacity-20">
                  <Zap className="w-4 h-4" />
                  <div className="h-px flex-1 bg-black" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
