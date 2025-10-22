import { Link } from "@tanstack/react-router";
import { Twitter, Instagram, Github, MessageCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // const [email, setEmail] = useState("");
  // const [isSubscribed, setIsSubscribed] = useState(false);

  // const handleSubscribe = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email) {
  //     // TODO: Implement newsletter subscription
  //     console.log("Subscribe email:", email);
  //     setIsSubscribed(true);
  //     setTimeout(() => {
  //       setIsSubscribed(false);
  //       setEmail("");
  //     }, 3000);
  //   }
  // };

  const footerLinks = {
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      // { name: "Careers", href: "/careers" },
      { name: "Help Center", href: "/help" },
    ],
    marketplace: [
      { name: "Explore", href: "/marketplace" },
      { name: "Create", href: "/upload" },
      { name: "Drops", href: "/drops" },
      { name: "Stats", href: "/stats" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Learn", href: "/learn" },
      { name: "Community", href: "/community" },
      { name: "Newsletter", href: "/newsletter" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { 
      name: "Twitter", 
      icon: Twitter, 
      href: "https://twitter.com/aureve",
      color: "hover:text-blue-400"
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      href: "https://instagram.com/aureve",
      color: "hover:text-pink-400"
    },
    { 
      name: "Discord", 
      icon: MessageCircle, 
      href: "https://discord.gg/aureve",
      color: "hover:text-indigo-400"
    },
    { 
      name: "GitHub", 
      icon: Github, 
      href: "https://github.com/aureve",
      color: "hover:text-gray-300"
    },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#09090b] mt-auto">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      </div>

      <div className="container mx-auto px-4 py-16">

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 md:gap-8">

          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-2xl font-bold text-white">Aureve</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              The next-generation NFT marketplace powered by lazy minting technology. 
              Create, trade, and own digital assets with zero upfront costs.
            </p>
            
            {/* Newsletter Subscription */}
            {/* <div className="mb-6">
              <h4 className="text-white text-sm font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shrink-0"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </form>
              {isSubscribed && (
                <p className="text-green-400 text-xs mt-2">Thanks for subscribing! 🎉</p>
              )}
            </div> */}
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Section */}
            

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 text-sm hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Marketplace Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Marketplace</h3>
              <ul className="space-y-3">
                {footerLinks.marketplace.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 text-sm hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 text-sm hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 text-sm hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {currentYear} Aureve Labs. All rights reserved.
            </div>
            
            {/* Network Status / Additional Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
