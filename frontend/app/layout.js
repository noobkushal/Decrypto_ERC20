import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NetworkWrapper from "@/components/NetworkWrapper";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Decrypto Deploy Wizard | Industrial Edition",
  description: "Deploy your tokens and vesting contracts with industrial efficiency.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background min-h-screen`}>
        <WalletProvider>
          <NetworkWrapper>
            <Navbar />
            <main className="bg-grid-light min-h-[calc(100vh-73px)] page-fade-in">
              <div className="max-w-7xl mx-auto p-12">
                {children}
              </div>
            </main>

            <footer className="border-t border-industrial-gray-200 py-12 px-12 bg-white">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div>
                  <div className="text-lg font-black uppercase italic">DECRYPTO INDUSTRIAL</div>
                  <div className="text-[10px] text-industrial-gray-500 mt-1 uppercase">© 2024 DECRYPTO INDUSTRIAL. ALL RIGHTS RESERVED.</div>
                </div>
                <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-industrial-gray-500">
                  <Link href="#" className="hover:text-black">Terms</Link>
                  <Link href="#" className="hover:text-black">Privacy</Link>
                  <Link href="#" className="hover:text-black">System Status</Link>
                  <Link href="#" className="hover:text-black">Audit</Link>
                </div>
              </div>
            </footer>
          </NetworkWrapper>
        </WalletProvider>
      </body>
    </html>
  );
}
