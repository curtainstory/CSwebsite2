import React, { useState } from "react";
import { ShoppingBag, Layers } from "lucide-react";
import { formatINR, UNITS } from "../utils/format";
import { HEADERS } from "../data/fabrics";

export default function CartPage({ cart, removeFromCart, clearCart, onNavigate }) {
  const [processing, setProcessing] = useState(false);
  const total = cart.reduce((s, i) => s + (i.price || 0), 0);

  const handleCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      clearCart();
      setProcessing(false);
      onNavigate("success");
    }, 1500);
  };

  if (!cart.length)
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Your cart is empty.</p>
        <button onClick={() => onNavigate("catalog")} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded">
          Browse Catalog
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>
      <div className="bg-white border rounded-lg shadow divide-y">
        {cart.map((item) => (
          <div key={item.cartId} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center">
              <img src={item.fabric.image} alt={item.fabric.name} className="h-20 w-20 rounded object-cover mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">{item.fabric.name}</h3>
                {item.type === "curtain" && (
                  <p className="text-sm text-gray-500">
                    {item.dimensions.width}×{item.dimensions.height} {item.unit} | 
                    {HEADERS.find((h) => h.id === item.headerStyle)?.name}
                  </p>
                )}
                {item.type === "fabric" && (
                  <p className="text-sm text-gray-500">{item.quantity} meters fabric</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-3 sm:mt-0">
              <span className="font-bold">{formatINR(item.price)}</span>
              <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:underline text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-xl font-bold">Total: {formatINR(total)}</span>
        <button
          onClick={handleCheckout}
          disabled={processing}
          className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700"
        >
          {processing ? "Processing…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
