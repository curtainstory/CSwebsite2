import React, { useState } from "react";
import {
  ShoppingBag,
  Ruler,
  Mail,
  Menu,
  X,
  Home as HomeIcon,
  Grid,
  PenTool,
  Scissors,
  Sofa,
} from "lucide-react";

export default function Header({ cartCount, onNavigate, currentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔹 Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "stitch-curtain", label: "Stitch Curtain", icon: Grid, view: "catalogues" },
    { id: "shop-fabric", label: "Shop Fabric", icon: Scissors, view: "catalogues" },
    { id: "sofa-fabric", label: "Buy Sofa Fabric", icon: Sofa, view: "catalogues" },
    { id: "measure", label: "Measurement Guide", icon: Ruler },
    { id: "design-services", label: "Design Services", icon: PenTool },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const handleNavClick = (item) => {
    if (item.id === "measure") {
      onNavigate("measure");
    } else if (item.view === "catalogues") {
      onNavigate("catalogues", item.id);
    } else {
      onNavigate(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white font-sans shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Left: Logo + mobile toggle */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="md:hidden mr-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <div
              className="cursor-pointer flex items-center"
              onClick={() => onNavigate("home")}
            >
              <img
                src="/logo.png"
                alt="Curtain Story"
                className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`relative flex items-center space-x-2 text-[15px] font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none ${
                    currentView === item.id
                      ? "text-indigo-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                  style={{
                    fontSmooth: "antialiased",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                  }}
                >
                  <item.icon className="h-4 w-4 opacity-80" />
                  <span className="pb-[1px] hover:tracking-[0.03em] transition-all">
                    {item.label}
                  </span>

                  {/* Elegant underline hover */}
                  <span
                    className={`absolute bottom-[-6px] left-0 w-full h-[2px] rounded-full transform transition-all duration-300 ${
                      currentView === item.id
                        ? "bg-indigo-500 opacity-100"
                        : "bg-indigo-400 opacity-0 group-hover:opacity-100"
                    }`}
                  ></span>
                </button>
              ))}
            </nav>

            {/* 🛍️ Cart */}
            <button
              onClick={() => onNavigate("cart")}
              className="relative p-2 text-white hover:text-indigo-400 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer tracking-wide"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 opacity-80" />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
