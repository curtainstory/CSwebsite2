import React, { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ConfigurePage from "./pages/ConfigurePage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import MeasurementGuide from "./pages/MeasurementGuide";
import DesignServices from "./pages/DesignServices";
import SuccessPage from "./pages/SuccessPage";
import CataloguesPage from "./pages/CataloguesPage";
import CatalogueDetails from "./pages/CatalogueDetails";
import { supabase } from "./supabaseClient";
import ChatBot from "./components/ChatBot";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [viewParams, setViewParams] = useState(null);
  const [cart, setCart] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [sofaFabrics, setSofaFabrics] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  const WHATSAPP_NUMBER = "7417410714";

  // 🧭 Detect view from URL — works for /admin, /dashboard, etc.
  useEffect(() => {
    const path = window.location.pathname.replace("/", "");
    const validViews = [
      "home",
      "catalog",
      "configure",
      "cart",
      "contact",
      "measure",
      "design-services",
      "success",
      "shop-fabric",
      "sofa-fabric",
      "catalogues",
      "catalogue-details",
      "admin",
      "dashboard",
    ];

    setCurrentView(validViews.includes(path) ? path : "home");
  }, []);

  // ✨ Smooth fade-in for floating buttons after 2s
  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🧵 Fetch Fabrics
  useEffect(() => {
    const fetchFabrics = async () => {
      const { data, error } = await supabase.from("fabrics").select("*");
      if (error) console.error(error);
      else {
        setFabrics(data.filter((f) => f.category?.toLowerCase() === "curtain"));
        setSofaFabrics(data.filter((f) => f.category?.toLowerCase() === "sofa"));
      }
    };
    fetchFabrics();
  }, []);

  // 🛒 Cart Handlers
  const addToCart = (item) =>
    setCart((prev) => [...prev, { ...item, cartId: Date.now() }]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.cartId !== id));
  const clearCart = () => setCart([]);

  // 🧭 Universal Navigation
  const onNavigate = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);
    window.history.pushState({}, "", `/${view}`);
    window.scrollTo(0, 0);
  };

  // 🔐 Supabase Admin Auth
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => setAdminUser(session?.user || null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // 🧩 Render Views
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <Home onNavigate={onNavigate} />;
      case "catalog":
        return <Catalog onNavigate={onNavigate} />;
      case "configure":
        return (
          <ConfigurePage
            addToCart={addToCart}
            fabricId={viewParams}
            onNavigate={onNavigate}
          />
        );
      case "cart":
        return (
          <CartPage
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            onNavigate={onNavigate}
          />
        );
      case "contact":
        return <ContactPage />;
      case "measure":
        return <MeasurementGuide />;
      case "design-services":
        return <DesignServices />;
      case "success":
        return <SuccessPage onNavigate={onNavigate} />;
      case "shop-fabric":
        return (
          <Catalog
            title="Shop Curtain Fabrics"
            onNavigate={onNavigate}
            data={fabrics}
            addToCart={(item) => {
              addToCart(item);
              onNavigate("cart");
            }}
          />
        );
      case "sofa-fabric":
        return (
          <Catalog
            title="Buy Sofa Upholstery"
            onNavigate={onNavigate}
            data={sofaFabrics}
            addToCart={(item) => {
              addToCart(item);
              onNavigate("cart");
            }}
          />
        );
      case "catalogues":
        return <CataloguesPage category={viewParams} onNavigate={onNavigate} />;
      case "catalogue-details":
        return (
          <CatalogueDetails
            catalogueId={viewParams}
            onNavigate={onNavigate}
          />
        );
      case "admin":
        return <AdminLogin onLogin={() => onNavigate("dashboard")} />;
      case "dashboard":
        return adminUser ? (
          <AdminDashboard
            onLogout={async () => {
              await supabase.auth.signOut();
              setAdminUser(null);
              onNavigate("admin");
            }}
          />
        ) : (
          <AdminLogin onLogin={() => onNavigate("dashboard")} />
        );
      default:
        return <Home onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      {!["admin", "dashboard"].includes(currentView) && (
        <Header
          cartCount={cart.length}
          onNavigate={onNavigate}
          currentView={currentView}
        />
      )}

      <main className="flex-grow">{renderView()}</main>

      {!["admin", "dashboard"].includes(currentView) && (
        <>
          {/* ✅ WhatsApp Floating Button (Right) */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to order curtains.`}
            target="_blank"
            rel="noreferrer"
            className={`fixed bottom-8 right-6 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl text-white flex items-center justify-center z-40 animate-float-slow whatsapp-glow transition-all duration-500 ${
              showButtons
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            title="Chat on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              className="whatsapp-icon"
            >
              <path d="M16.003 3.004A12.997 12.997 0 0 0 3.002 16c0 2.3.6 4.4 1.6 6.3l-1.7 6.6 6.8-1.8a13.12 13.12 0 0 0 6.3 1.6A13 13 0 1 0 16.003 3zm0 23.7c-2 0-3.9-.5-5.6-1.4l-.4-.2-4 .9.9-3.9-.2-.4A10.86 10.86 0 0 1 5.1 16a10.9 10.9 0 1 1 10.9 10.7zm6.2-7.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.7 0s-1.3-.5-2.5-1.6c-.9-.8-1.5-1.8-1.6-2.1s-.1-.5.1-.7l.5-.6c.2-.3.2-.4.3-.7.1-.3 0-.5-.1-.7-.2-.2-.7-1.6-.9-2.1-.3-.5-.5-.4-.7-.4h-.6c-.3 0-.7.1-1 .5-.3.3-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.8c.2.2 2.5 3.9 6.1 5.4.9.4 1.7.6 2.3.7.9.1 1.8.1 2.4.1.8 0 1.7-.5 2-1.1.2-.6.2-1.1.2-1.2 0-.2-.3-.3-.6-.4z" />
            </svg>
          </a>

          {/* ✅ Chatbot Floating (Left) */}
          <div
            className={`fixed bottom-8 left-6 z-50 transition-all duration-700 ${
              showButtons
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            } animate-float-fast`}
          >
            <div className="animate-pulse-glow">
              <ChatBot />
            </div>
          </div>

          {/* ✅ Floating Animations + Responsive Sizes */}
          <style>{`
            @keyframes floatSlow {
              0% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
              100% { transform: translateY(0); }
            }
            @keyframes floatFast {
              0% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
              100% { transform: translateY(0); }
            }
            .animate-float-slow { animation: floatSlow 5.5s ease-in-out infinite; }
            .animate-float-fast { animation: floatFast 4s ease-in-out infinite; animation-delay: 1.2s; }

            @keyframes pulseGlow {
              0% { box-shadow: 0 0 0 rgba(99,102,241,0); transform: scale(1); }
              50% { box-shadow: 0 0 20px rgba(99,102,241,0.4); transform: scale(1.04); }
              100% { box-shadow: 0 0 0 rgba(99,102,241,0); transform: scale(1); }
            }
            .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; border-radius: 50%; }

            @keyframes pulseGreenGlow {
              0% { box-shadow: 0 0 0 rgba(34,197,94,0); transform: scale(1); }
              50% { box-shadow: 0 0 18px rgba(34,197,94,0.45); transform: scale(1.05); }
              100% { box-shadow: 0 0 0 rgba(34,197,94,0); transform: scale(1); }
            }
            .whatsapp-glow { animation: pulseGreenGlow 3s ease-in-out infinite; border-radius: 50%; }

            /* 📱 Adaptive Sizes */
            .whatsapp-glow, .animate-pulse-glow > button {
              width: 48px; height: 48px;
            }
            .whatsapp-icon { width: 24px; height: 24px; }

            @media (min-width: 768px) {
              .whatsapp-glow, .animate-pulse-glow > button {
                width: 56px; height: 56px;
              }
              .whatsapp-icon { width: 28px; height: 28px; }
            }

            @media (min-width: 1280px) {
              .whatsapp-glow, .animate-pulse-glow > button {
                width: 64px; height: 64px;
              }
              .whatsapp-icon { width: 32px; height: 32px; }
            }
          `}</style>

          <Footer />
        </>
      )}
    </div>
  );
}
