import React, { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { supabase } from "../supabaseClient";
import { formatINR } from "../utils/format";

export default function FabricPurchasePage({ addToCart, fabricId, onNavigate }) {
  const [fabric, setFabric] = useState(null);
  const [meters, setMeters] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🧵 Fetch Fabric Data
  useEffect(() => {
    const fetchFabric = async () => {
      if (!fabricId) return;
      const { data, error } = await supabase
        .from("fabrics")
        .select("*")
        .eq("id", fabricId)
        .single();

      if (error) console.error("Error fetching fabric:", error);
      else setFabric(data);
      
      setLoading(false);
    };
    fetchFabric();
  }, [fabricId]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading details...</div>;

  if (!fabric)
    return (
      <div className="text-center py-20 text-gray-500">
        Fabric not found.
        <button onClick={() => onNavigate("home")} className="text-indigo-600 underline ml-2">Go Home</button>
      </div>
    );

  // ✅ Smart Back Navigation
  const isSofa = fabric.category === 'sofa-fabric';
  const backLink = isSofa ? "sofa-fabric" : "shop-fabric";
  const backText = isSofa ? "Back to Sofa Fabrics" : "Back to Shop Fabrics";

  const totalPrice = Math.round(fabric.price * meters);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 🔙 Dynamic Back Button */}
      <button
        onClick={() => onNavigate(backLink)}
        className="flex items-center text-gray-500 mb-8 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> {backText}
      </button>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* 🖼️ Fabric Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
          <img
            src={fabric.image_url || "https://via.placeholder.com/600x600"}
            alt={fabric.name}
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>

        {/* 📝 Purchase Details */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block ${
            isSofa ? "bg-orange-100 text-orange-700" : "bg-indigo-50 text-indigo-700"
          }`}>
            {isSofa ? "Sofa Upholstery" : "Curtain Fabric"}
          </span>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{fabric.name}</h1>
          <p className="text-gray-500 mb-6">{fabric.description || "Premium quality fabric."}</p>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-bold text-gray-900">{formatINR(fabric.price)}</span>
            <span className="text-gray-400 text-sm">/ meter</span>
          </div>

          {/* Width Info */}
          {fabric.width && (
            <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
              <span className="font-bold">Fabric Width:</span> {fabric.width} inches
            </div>
          )}

          <div className="border-t border-b border-gray-100 py-6 mb-8">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Quantity (Meters)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                <button
                  onClick={() => setMeters(Math.max(1, meters - 1))}
                  className="px-4 py-3 hover:bg-white text-gray-600 rounded-l-lg transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input 
                  type="number" 
                  min="1"
                  value={meters}
                  onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center bg-transparent font-bold text-gray-900 outline-none"
                />
                <button
                  onClick={() => setMeters(meters + 1)}
                  className="px-4 py-3 hover:bg-white text-gray-600 rounded-r-lg transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">meters</span>
            </div>
          </div>

          {/* Total & Action */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-600 font-medium">Total Cost:</span>
            <span className="text-3xl font-bold text-indigo-600">{formatINR(totalPrice)}</span>
          </div>

          <button
            onClick={() => {
              addToCart({
                ...fabric, 
                cartId: Date.now(),
                quantity: meters,
                totalPrice: totalPrice,
                type: 'meterage',
                unit: 'meters'
              });
              onNavigate("cart");
            }}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}