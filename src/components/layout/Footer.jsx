import React from "react";
import { Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#45483E] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold flex items-center mb-4">
              <img src="/logo.png" alt="Curtain Story" className="h-12 w-auto object-contain mr-2" />
            </span>
            <p className="text-[#D9D5CC] text-sm leading-relaxed">
              Crafting custom window treatments for homes that deserve perfection. Premium fabrics, expert stitching, and personalized service.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FAF7F2]">Customer Care</h4>
            <ul className="space-y-2 text-[#D9D5CC] text-sm">
              <li>Measurement Guide</li>
              <li>Installation Tips</li>
              <li>Shipping & Returns</li>
              <li>Fabric Care</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FAF7F2]">Connect With Us</h4>
            <div className="flex items-center text-[#D9D5CC] text-sm mb-2">
              <Phone className="h-4 w-4 mr-3" /> 7417410714
            </div>
            <div className="flex items-center text-[#D9D5CC] text-sm mb-2">
              <Mail className="h-4 w-4 mr-3" /> curtainstory.info@gmail.com
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="bg-[#53564B] p-2 rounded-full hover:bg-[#626658] transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="bg-[#53564B] p-2 rounded-full hover:bg-[#626658] transition">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#65685C] pt-6 text-center text-[#C4BFB4] text-sm">
          &copy; {new Date().getFullYear()} Curtain Story. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
