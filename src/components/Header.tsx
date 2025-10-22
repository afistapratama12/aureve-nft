import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Wallet, Plus, Store, Home, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NetworkSwitcher } from "@/components/NetworkSwitcher";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address, isConnected, openModal } = useWallet();
  const navigate = useNavigate();

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleWalletClick = () => {
    if (isConnected) {
      // Redirect to profile if already connected
      navigate({ to: "/profile" });
    } else {
      // Open Web3Modal if not connected
      openModal();
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/marketplace", label: "Marketplace", icon: Store },
    { to: "/swap", label: "Swap", icon: ArrowLeftRight },
    { to: "/upload", label: "Create", icon: Plus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/100 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left Side */}
          <Link
            to="/"
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-lg font-bold">A</span>
              </div>
            </div>
            <span className="text-white text-xl font-semibold tracking-tight group-hover:text-white/90 transition">
              Aureve
            </span>
          </Link>

          {/* Nav Links - Center (Absolute Positioning) */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200",
                  "text-gray-400 hover:text-white",
                  "after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:transition-all after:duration-300 hover:after:w-full"
                )}
                activeProps={{
                  className: "text-white after:w-full",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet & Network Switcher - Right Side */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {isConnected && <NetworkSwitcher />}
            
            <Button
              onClick={handleWalletClick}
              className={cn(
                "relative h-9 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                isConnected 
                  ? "bg-white/5 text-white hover:bg-white/10 border border-white/10" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              )}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnected ? shortenAddress(address!) : "Connect Wallet"}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/[0.08] bg-[#09090b]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  activeProps={{
                    className: "text-white bg-white/5",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 space-y-2">
                <Button
                  onClick={() => {
                    handleWalletClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full h-11 rounded-lg text-sm font-medium",
                    isConnected 
                      ? "bg-white/5 text-white hover:bg-white/10 border border-white/10" 
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25"
                  )}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnected ? shortenAddress(address!) : "Connect Wallet"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
