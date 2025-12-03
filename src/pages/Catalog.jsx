import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { formatINR } from "../utils/format";

export default function Catalog({ onNavigate, title = "Choose Your Fabric", addToCart }) {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧵 Fetch fabrics from Supabase
  useEffect(() => {
    const fetchFabrics = async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading fabrics:", error);
      } else {
        setFabrics(data);
      }
      setLoading(false);
    };

    fetchFabrics();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading fabrics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>

      {fabrics.length === 0 ? (
        <p className="text-center text-gray-500">No fabrics found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fabrics.map((fabric) => (
            <div
              key={fabric.id}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={fabric.image_url || "https://via.placeholder.com/400x300"}
                alt={fabric.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-5 flex flex-col justify-between h-44">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{fabric.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {fabric.description || "Beautiful fabric."}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="font-medium text-gray-900">
                    {formatINR(fabric.price_per_meter)} <span className="text-sm text-gray-500">/ meter</span>
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("configure", fabric.id)}
                  className="mt-4 bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
                >
                  Customize →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
