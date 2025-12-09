import React, { useState, useEffect } from "react";
import { Minus, Plus, Calculator, ArrowLeft, Check } from "lucide-react";
import { supabase } from "../supabaseClient";
import { formatINR, UNITS } from "../utils/format";

// 🧮 Cost Calculation Logic (Fixed & Safe)
function calcPrice(fabric, dims, headerStyle, unitId, qty = 1) {
  // Return safe defaults if data isn't ready
  if (!fabric) return { total: 0, fabricCost: 0, stitchingCost: 0, totalFabric: 0, recommendedPanels: 1 };

  const unit = UNITS.find((u) => u.id === unitId) || UNITS[0];
  
  // Dimensions
  const widthFeet = (dims.width || 0) * unit.toFeet;
  const heightMeters = (dims.height || 0) * unit.toMeter;
  
  // ✅ Dynamic Panel Calculation based on Fabric Width
  const fabricWidth = parseFloat(fabric.width) || 54; // Default to 54 if missing
  // Logic: 54" fabric (4.5ft) covers ~2.25ft flat. At 2x fullness (pleated), it covers ~1.125ft of rod per panel.
  // Simplified for estimation: 54" covers ~2ft of rod. 48" covers ~1.7ft.
  const coveragePerPanel = (fabricWidth / 12) / 2.2; 
  const recommendedPanels = Math.max(1, Math.ceil(widthFeet / coveragePerPanel));

  // Fabric Consumption (Height + Hems)
  const fabricPerPanel = heightMeters + 0.4; 
  const totalFabric = fabricPerPanel * qty;
  
  // Costs
  // ✅ FIX: Use 'price' to match DB, not 'price_per_meter'
  const pricePerMeter = parseFloat(fabric.price) || 0; 
  const fabricCost = totalFabric * pricePerMeter;
  
  // Stitching Rates
  const stitchingRates = { "Ring Top": 250, "Pleated": 350, "Pocket": 200 };
  const stitchingRate = stitchingRates[headerStyle] || 250;
  const stitchingCost = stitchingRate * qty;

  // ✅ FIX: Ensure total is never NaN
  const total = Math.round(fabricCost + stitchingCost);

  return {
    totalFabric: totalFabric.toFixed(2),
    fabricCost: Math.round(fabricCost),
    stitchingCost: Math.round(stitchingCost),
    total: isNaN(total) ? 0 : total, 
    recommendedPanels,
  };
}

export default function ConfigurePage({ addToCart, fabricId, onNavigate }) {
  const [fabric, setFabric] = useState(null);
  const [headerStyle, setHeaderStyle] = useState("Ring Top");
  const [dims, setDims] = useState({ width: 6, height: 7 });
  const [unit, setUnit] = useState("feet");
  const [ringType, setRingType] = useState("Metal");
  const [qty, setQty] = useState(2);
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch Fabric Data
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

  if (loading) return <div className="text-center py-20 text-gray-500">Loading configuration...</div>;

  if (!fabric)
    return (
      <div className="text-center py-20 text-gray-500">
        Fabric not found.
        <button onClick={() => onNavigate("catalogues")} className="text-indigo-600 underline ml-2">Go Back</button>
      </div>
    );

  const price = calcPrice(fabric, dims, headerStyle, unit, qty);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate("catalogues")}
        className="flex items-center text-gray-500 mb-6 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* 🖼️ LEFT: Fabric Image & Details */}
        <div>
          <div className="sticky top-8">
            <img
              src={fabric.image_url || "https://via.placeholder.com/600x800"}
              alt={fabric.name}
              className="rounded-xl shadow-lg w-full object-cover max-h-[600px]"
            />
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900">{fabric.name}</h1>
              <p className="text-gray-500 text-lg mt-2">{fabric.description}</p>
              <div className="flex gap-3 mt-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Width: {fabric.width || 54}"
                </span>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-100">
                  {formatINR(fabric.price)}/m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ⚙️ RIGHT: Configuration Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 lg:p-8 h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
            Customize Your Curtain
          </h2>

          {/* 1️⃣ MEASUREMENTS */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                1. Dimensions
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded text-sm px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {UNITS.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width ({unit})</label>
                <input
                  type="number"
                  min="1"
                  value={dims.width}
                  onChange={(e) => setDims({ ...dims, width: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height ({unit})</label>
                <input
                  type="number"
                  min="1"
                  value={dims.height}
                  onChange={(e) => setDims({ ...dims, height: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3">
              <Calculator className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Based on rod width, we recommend <strong>{price.recommendedPanels} panels</strong>.
              </p>
            </div>
          </div>

          {/* 2️⃣ QUANTITY */}
          <div className="mb-8">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">
              2. Quantity (Panels)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-bold text-gray-900 w-12 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">panels total</span>
            </div>
          </div>

          {/* 3️⃣ HEADER STYLE */}
          <div className="mb-8">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">
              3. Header Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Ring Top", "Pleated"].map((style) => (
                <div
                  key={style}
                  onClick={() => setHeaderStyle(style)}
                  className={`cursor-pointer border rounded-lg p-3 flex items-center justify-between transition-all ${
                    headerStyle === style
                      ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-700">{style}</span>
                  {headerStyle === style && <Check className="h-4 w-4 text-indigo-600" />}
                </div>
              ))}
            </div>
          </div>

          {/* 4️⃣ RING TYPE */}
          {headerStyle === "Ring Top" && (
            <div className="mb-8 animate-fade-in">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">
                4. Ring Material <span className="text-xs text-gray-400 font-normal normal-case">(Included)</span>
              </label>
              <div className="flex gap-4">
                {["Metal", "Fiber"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${ringType === type ? 'border-indigo-600' : 'border-gray-300'}`}>
                        {ringType === type && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                    </div>
                    <input type="radio" name="ring" className="hidden" checked={ringType === type} onChange={() => setRingType(type)} />
                    <span className={`text-sm ${ringType === type ? 'text-indigo-700 font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>{type} Rings</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 🧾 SUMMARY & TOTAL */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Fabric ({price.totalFabric} m)</span>
              <span>{formatINR(price.fabricCost)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Stitching & Labor</span>
              <span>{formatINR(price.stitchingCost)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
              <span className="text-lg font-bold text-gray-900">Total Price</span>
              <span className="text-2xl font-bold text-indigo-600">{formatINR(price.total)}</span>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={() => {
              addToCart({
                ...fabric, 
                cartId: Date.now(),
                dimensions: dims,
                unit,
                headerStyle,
                ringType: headerStyle === "Ring Top" ? ringType : null,
                quantity: qty,
                totalPrice: price.total, 
                fabricCost: price.fabricCost,
                stitchingCost: price.stitchingCost
              });
              onNavigate("cart");
            }}
            className="w-full mt-6 bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg active:scale-[0.98]"
          >
            Add to Cart - {formatINR(price.total)}
          </button>
        </div>
      </div>
    </div>
  );
}