"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Shield, Bell, Settings } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
  const { account, connectWallet, loading: walletLoading } = useWallet();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Show progress bar on path change
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const navLinks = [
    { name: "DASHBOARD", href: "/dashboard" },
    { name: "WIZARD", href: "/wizard" },
    { name: "CLAIM", href: "/claim" },
    { name: "SECURITY", href: "/security" },
    { name: "SETTINGS", href: "/settings" },
    { name: "LOGIN", href: "/login" },
  ];


  return (
    <>
      {/* Global Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-industrial-emerald origin-left animate-progress" style={{ display: 'block' }} />
      )}

      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-industrial-gray-200 px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link href="/" onClick={() => pathname !== "/" && setIsNavigating(true)} className="text-2xl font-black tracking-tighter uppercase italic">
              DECRYPTO
            </Link>
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    onClick={() => pathname !== link.href && link.href !== "#" && setIsNavigating(true)}
                    className={`text-[10px] font-black uppercase tracking-widest transition-all pb-1 border-b-2 ${
                      isActive 
                        ? "text-black border-black" 
                        : "text-industrial-gray-500 border-transparent hover:text-black hover:border-black/30"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5 text-industrial-gray-500">
              <button className="hover:text-black transition-colors"><Bell className="w-4 h-4" /></button>
              <Link href="/settings" onClick={() => pathname !== "/settings" && setIsNavigating(true)} className="hover:text-black transition-colors">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
            <button 
              onClick={connectWallet}
              disabled={walletLoading}
              className="bg-black text-white px-8 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-industrial-gray-900 transition-all min-w-[160px] active:scale-95"
            >
              {walletLoading ? "SYNCING..." : account ? `${account.slice(0,6)}...${account.slice(-4)}` : "CONNECT WALLET"}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
