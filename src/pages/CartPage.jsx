import React, { useState } from "react";
import { Trash2, ArrowRight, ShoppingBag, Scissors, Ruler, Sofa, User, Phone, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import GPayButton from "../components/ui/GooglePayButton"; 

const formatINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CartPage({ cart, removeFromCart, clearCart, onNavigate }) {
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Grand Total
  const grandTotal = cart.reduce((sum, item) => {
    const itemTotal = item.totalPrice || item.price || 0;
    return sum + itemTotal;
  }, 0);

  // 💾 Shared: Save Order to Database
  const saveOrderToDB = async (status = "Pending") => {
    const { error } = await supabase.from("orders").insert([
      {
        customer_name: customer.name,
        customer_phone: customer.phone,
        items: cart, 
        total_amount: grandTotal,
        status: status 
      }
    ]);
    if (error) throw error;
  };

  // 🟢 Option 1: WhatsApp Checkout
  const handleWhatsAppCheckout = async () => {
    if (!customer.name || !customer.phone) {
      alert("Please enter your Name and Phone Number first.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Database
      await saveOrderToDB("Pending");

      // 2. Generate WhatsApp Message
      // ⚠️ IMPORTANT: This must be YOUR (Store Owner's) Number.
      // If you change this to customer.phone, the store will NOT receive the order.
      const STORE_OWNER_NUMBER = "7417410714"; 
      
      let message = `*New Order Request*\n`;
      message += `👤 Name: ${customer.name}\n`;
      message += `📞 Buyer Phone: ${customer.phone}\n\n`; // Includes buyer's number in the text
      message += `*Items Ordered:*`;

      cart.forEach((item, index) => {
        message += `\n\n${index + 1}. *${item.name}*`;
        if (item.headerStyle) {
          const width = item.dimensions?.width || 0;
          const height = item.dimensions?.height || 0;
          message += `\n   ✂️ Custom: ${item.headerStyle}`;
          message += `\n   📏 Size: ${width}x${height} ${item.unit}`;
          message += `\n   🪟 Panels: ${item.quantity}`;
        } else if (item.type === 'meterage') {
          message += `\n   🧵 Fabric: ${item.quantity} meters`;
        } else {
          message += `\n   📦 Qty: ${item.quantity}`;
        }
        message += `\n   💰 ₹${item.totalPrice || item.price}`;
      });

      message += `\n\n*Total: ${formatINR(grandTotal)}*`;
      message += `\n\nI would like to confirm this order.`;

      // 3. Open WhatsApp (Buyer sends message TO Store Owner)
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${STORE_OWNER_NUMBER}?text=${encodedMessage}`, "_blank");
      
      clearCart();
      onNavigate("success");

    } catch (err) {
      console.error("Order Error:", err);
      alert("Error saving order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔵 Option 2: Google Pay Success
  const handleGPaySuccess = async (paymentData) => {
    setIsSubmitting(true);
    try {
      console.log("GPay Success:", paymentData);
      await saveOrderToDB("Paid (GPay)");
      clearCart();
      onNavigate("success");
    } catch (err) {
      console.error("GPay Save Error:", err);
      alert("Payment processed, but order save failed. Contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6"><ShoppingBag className="h-12 w-12 text-gray-400" /></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <div className="flex gap-4 mt-6">
          <button onClick={() => onNavigate("catalogues")} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Customize Curtains</button>
          <button onClick={() => onNavigate("shop-fabric")} className="px-6 py-3 bg-white border rounded-lg">Shop Fabrics</button>
        </div>
      </div>
    );
  }

  // ✅ Form Validation
  const isFormValid = customer.name && customer.phone;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12">
      {/* Left: Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart ({cart.length})</h1>
        {cart.map((item) => (
          <div key={item.cartId} className="bg-white border rounded-xl p-5 flex gap-6 relative shadow-sm">
            <img src={item.image_url || "https://via.placeholder.com/150"} alt={item.name} className="w-24 h-24 rounded-lg object-cover bg-gray-100" />
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <span className="font-bold text-indigo-600">{formatINR(item.totalPrice || item.price)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                 {item.headerStyle ? `Custom: ${item.headerStyle} | ${item.quantity} panels` : `Qty: ${item.quantity}`}
              </div>
            </div>
            <button onClick={() => removeFromCart(item.cartId)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600"><Trash2 size={20}/></button>
          </div>
        ))}
        <button onClick={clearCart} className="text-red-600 text-sm hover:underline flex items-center gap-1"><Trash2 size={16} /> Clear Cart</button>
      </div>

      {/* Right: Checkout & Payment */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Checkout</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50"><User size={16} className="text-gray-400 mr-2"/><input type="text" placeholder="Full Name" className="w-full bg-transparent outline-none" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}/></div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50"><Phone size={16} className="text-gray-400 mr-2"/><input type="tel" placeholder="Phone Number" className="w-full bg-transparent outline-none" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}/></div>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center mb-6">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-2xl text-indigo-600">{formatINR(grandTotal)}</span>
          </div>

          {/* 🟢 WhatsApp Checkout */}
          <button
            onClick={handleWhatsAppCheckout}
            disabled={isSubmitting || !isFormValid}
            className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-md mb-4 ${
              isSubmitting || !isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <>WhatsApp Checkout <ArrowRight size={18}/></>}
          </button>

          {/* 🔵 Google Pay */}
          <div className="border-t pt-4">
             <div className="text-center text-xs text-gray-400 mb-2 font-medium tracking-wide">- OR PAY SECURELY -</div>
             
             <GPayButton 
               totalAmount={grandTotal} 
               onPaymentSuccess={handleGPaySuccess} 
               disabled={!isFormValid}
             />
          </div>

        </div>
      </div>
    </div>
  );
}