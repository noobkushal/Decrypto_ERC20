"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

export function WalletProvider({ children }) {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemConfig, setSystemConfig] = useState({ rpcUrl: "", hasPrivateKey: false });
  const listenersSet = useRef(false);

  // Load config only once, and don't block
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setSystemConfig({ 
          rpcUrl: data.rpcUrl, 
          hasPrivateKey: data.privateKey && data.privateKey !== "********" 
        });
      } catch (e) {
        console.error("Config load failed", e);
      }
    };
    loadConfig();
  }, []);

  const checkNetwork = useCallback(async (currentChainId) => {
    if (currentChainId && currentChainId !== SEPOLIA_CHAIN_ID) {
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
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: "Sepolia Test Network",
                  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://rpc.ankr.com/eth_sepolia"], 
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add Sepolia network", addError);
          }
        }
      }
    }
  }, []);

  const connectWallet = async () => {
    console.log("Connect Wallet Triggered");
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Metamask not detected. Please install the browser extension or open in a Web3 browser.");
      return;
    }
    
    setLoading(true);
    try {
      // Requesting accounts - this triggers the Metamask popup
      console.log("Requesting accounts...");
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Connected:", accounts[0]);
        
        const chain = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(chain);
        await checkNetwork(chain);
      }
    } catch (err) {
      console.error("Connection failed:", err);
      if (err.code === 4001) {
        alert("Connection rejected. Please approve the request in Metamask.");
      } else {
        alert(`Connection Error: ${err.message || "Unknown Error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum && !listenersSet.current) {
      // Initial check
      window.ethereum.request({ method: "eth_accounts" }).then((accs) => {
        if (accs.length > 0) {
          setAccount(accs[0]);
          window.ethereum.request({ method: "eth_chainId" }).then(setChainId);
        }
      });

      // Listeners
      const handleAccounts = (accs) => setAccount(accs[0] || "");
      const handleChain = (newChain) => {
        setChainId(newChain);
        checkNetwork(newChain);
      };

      window.ethereum.on("accountsChanged", handleAccounts);
      window.ethereum.on("chainChanged", handleChain);

      listenersSet.current = true;

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccounts);
        window.ethereum.removeListener("chainChanged", handleChain);
      };
    }
  }, [checkNetwork]);

  return (
    <WalletContext.Provider value={{ account, chainId, connectWallet, loading, systemConfig }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
