import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function CataloguesPage({ onNavigate, mode = "stitch" }) {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const { data, error } = await supabase
          .from("catalogs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCatalogs(data || []);
      } catch (err) {
        console.error("Error fetching catalogues:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  // ✅ Handle Click based on Mode
  const handleCatalogClick = (id) => {
    if (mode === "shop") {
      onNavigate("shop-catalogue-details", id); // Go to Shop version
    } else {
      onNavigate("catalogue-details", id); // Go to Stitch version
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {mode === "shop" ? "Shop Fabric Collections" : "Stitch Curtain Collections"}
      </h1>
      <p className="text-gray-500 mb-8">
        {mode === "shop" 
          ? "Select a collection to buy fabrics by meter." 
          : "Select a collection to customize your curtains."}
      </p>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading collections...</div>
      ) : catalogs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No catalogues found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogs.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCatalogClick(cat.id)}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cat.cover_image || "https://via.placeholder.com/600x400"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {cat.description || "Beautiful curtain designs for your home."}
                </p>
                <div className="mt-4 text-indigo-600 font-semibold text-sm flex items-center">
                  {mode === "shop" ? "Browse Fabrics" : "View Designs"} →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}