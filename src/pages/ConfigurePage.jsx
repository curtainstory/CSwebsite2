import React, { useState, useEffect } from "react";
import { Minus, Plus, Calculator } from "lucide-react";
import { supabase } from "../supabaseClient";
import { formatINR, UNITS } from "../utils/format";

function calcPrice(fabric, dims, header, unitId, qty = 1) {
  if (!fabric || !header) {
    return {
      total: 0,
      fabricCost: 0,
      stitchingCost: 0,
      totalFabric: 0,
      recommendedPanels: 1,
    };
  }

  const unit = UNITS.find((u) => u.id === unitId) || UNITS[0];
  const widthFeet = dims.width * unit.toFeet;
  const heightMeters = dims.height * unit.toMeter;
  const recommendedPanels = Math.max(1, Math.ceil(widthFeet / 2));

  const fabricPerPanel = heightMeters + 0.4;
  const totalFabric = fabricPerPanel * qty;
  const fabricCost = totalFabric * (fabric.price_per_meter || 0);
  const stitchingCost = (header.stitching_price || 0) * qty;

  return {
    totalFabric: totalFabric.toFixed(2),
    fabricCost: Math.round(fabricCost),
    stitchingCost: Math.round(stitchingCost),
    total: Math.round(fabricCost + stitchingCost),
    recommendedPanels,
  };
}

export default function ConfigurePage({ addToCart, fabricId, onNavigate }) {
  const [fabric, setFabric] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [dims, setDims] = useState({ width: 6, height: 7 });
  const [unit, setUnit] = useState("feet");
  const [ringType, setRingType] = useState("metal");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const { data: fabricData } = await supabase
        .from("fabrics")
        .select("*")
        .eq("id", fabricId)
        .single();

      const { data: headerData } = await supabase
        .from("headers")
        .select("*")
        .order("created_at", { ascending: true });

      setFabric(fabricData);
      setHeaders(headerData || []);
      setSelectedHeader(headerData?.[0] || null);
      setLoading(false);
    };
    if (fabricId) fetchData();
  }, [fabricId]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading configuration...
      </div>
    );

  if (!fabric)
    return (
      <div className="text-center py-20 text-gray-500">
        Fabric not found.
        <button
          onClick={() => onNavigate("catalog")}
          className="text-indigo-600 underline ml-1"
        >
          Go Back
        </button>
      </div>
    );

  const price = calcPrice(fabric, dims, selectedHeader, unit, qty);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => onNavigate("catalog")}
        className="text-indigo-600 mb-6 hover:underline"
      >
        ← Back to Fabrics
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Fabric Image & Info */}
        <div>
          <img
            src={
              fabric.image_url ||
              "https://via.placeholder.com/500x400?text=Fabric+Image"
            }
            alt={fabric.name}
            className="rounded-lg shadow-md w-full object-cover"
          />
          <h1 className="text-3xl font-bold mt-6">{fabric.name}</h1>
          <p className="text-gray-600 mt-2">{fabric.description}</p>
          <p className="text-sm text-gray-500 mt-3">
            💡 Price includes fabric and specialized stitching.
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white border rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Configuration
          </h2>

          {/* 1️⃣ MEASURE & ESTIMATE */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-800">
                1. MEASURE & ESTIMATE
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Unit:</span>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500"
                >
                  {UNITS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Width of Curtain Rod/Track ({unit})
                </label>
                <input
                  type="number"
                  value={dims.width}
                  onChange={(e) =>
                    setDims({ ...dims, width: +e.target.value || 0 })
                  }
                  className="border rounded-md p-2 w-full focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Curtain Height ({unit})
                </label>
                <input
                  type="number"
                  value={dims.height}
                  onChange={(e) =>
                    setDims({ ...dims, height: +e.target.value || 0 })
                  }
                  className="border rounded-md p-2 w-full focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4 border border-blue-200 bg-blue-50 rounded-md p-3 flex items-start text-sm text-blue-800">
              <Calculator className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
              <div>
                <span className="font-semibold text-blue-700">
                  Recommendation:
                </span>{" "}
                Based on your rod width, we recommend buying{" "}
                <span className="font-bold text-blue-700">
                  {price.recommendedPanels}
                </span>{" "}
                curtains.
              </div>
            </div>
          </div>

          {/* 2️⃣ PANEL INFO */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">
              2. PANEL INFO
            </label>
            <div className="text-gray-700">
              Panel Width (Fixed): <b>54 inches</b>
            </div>
            <p className="text-xs text-gray-500">
              Standard fabric width per panel for this fabric.
            </p>
          </div>

          {/* 3️⃣ SELECT QUANTITY */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">
              3. SELECT QUANTITY
            </label>
            <div className="flex items-center border rounded w-max">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 4️⃣ HEADER STYLES (Perfect Fit, Like Screenshot) */}
          <div className="mb-10">
            <label className="block text-sm font-semibold mb-4 text-gray-800">
              4. SELECT HEADER STYLE
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {headers.map((h) => (
                <div
                  key={h.id}
                  onClick={() => setSelectedHeader(h)}
                  className={`cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden border ${
                    selectedHeader?.id === h.id
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                  }`}
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <img
                      src={
                        h.image_url ||
                        "https://via.placeholder.com/1000x600?text=Curtain+Preview"
                      }
                      alt={h.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {selectedHeader?.id === h.id && (
                      <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        Selected
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {h.name}
                    </h3>
                    <p className="text-sm text-indigo-600 font-semibold mt-1">
                      Stitching: ₹{h.stitching_price} / pc
                    </p>
                    <p className="text-xs text-gray-500 mt-2 leading-snug">
                      {h.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ring Material Choice */}
            {selectedHeader?.name?.toLowerCase().includes("ring") && (
              <div className="mt-10 border-t border-gray-200 pt-5">
                <p className="font-medium text-sm text-gray-800 mb-2">
                  Select Ring Material{" "}
                  <span className="text-gray-500">(No Extra Cost)</span>
                </p>
                <div className="flex flex-wrap gap-8 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ring"
                      checked={ringType === "metal"}
                      onChange={() => setRingType("metal")}
                      className="accent-indigo-600"
                    />
                    <span>Metal Ring</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ring"
                      checked={ringType === "fiber"}
                      onChange={() => setRingType("fiber")}
                      className="accent-indigo-600"
                    />
                    <span>Fiber Ring</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="border-t pt-4 text-sm space-y-2">
            <h3 className="font-semibold text-gray-800">Order Summary</h3>
            <div className="flex justify-between">
              <span>Total Fabric Required:</span>
              <span>{price.totalFabric} meters</span>
            </div>
            <div className="flex justify-between">
              <span>Fabric Cost:</span>
              <span>{formatINR(price.fabricCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Stitching ({selectedHeader?.name}):</span>
              <span>{formatINR(price.stitchingCost)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total Price:</span>
              <span>{formatINR(price.total)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => {
                addToCart({
                  fabric,
                  dimensions: dims,
                  unit,
                  headerStyle: selectedHeader?.name,
                  ringType,
                  quantity: qty,
                  price: price.total,
                  priceDetails: price,
                });
                onNavigate("cart");
              }}
              className="border border-indigo-600 text-indigo-600 rounded py-2 hover:bg-indigo-50 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onNavigate("success")}
              className="bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
