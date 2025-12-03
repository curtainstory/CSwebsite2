import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { formatINR } from "../utils/format";

export default function FabricShop({ title, data, onAddToCart }) {
  const [quantities, setQuantities] = useState({});

  const updateQuantity = (id, change) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + change) }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-extrabold mb-8">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((f) => (
          <div
            key={f.id}
            className="bg-white border rounded-lg shadow-sm hover:shadow-lg overflow-hidden flex flex-col"
          >
            <img src={f.image} alt={f.name} className="h-64 object-cover" />
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold">{f.name}</h3>
                <p className="text-gray-500 text-sm">{f.description}</p>
                <p className="mt-2 font-semibold text-gray-900">
                  {formatINR(f.pricePerMeter)}{" "}
                  <span className="text-gray-400 text-sm">/m</span>
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(f.id, -1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3">{quantities[f.id] || 1}m</span>
                  <button
                    onClick={() => updateQuantity(f.id, 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() =>
                    onAddToCart({
                      fabric: f,
                      quantity: quantities[f.id] || 1,
                      price: f.pricePerMeter * (quantities[f.id] || 1),
                      type: "fabric",
                      unit: "meters",
                    })
                  }
                  className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
