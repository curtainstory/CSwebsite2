import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Ruler, ArrowLeft, Sofa } from "lucide-react";

export default function FabricListingPage({ title, category, onNavigate }) {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFabrics = async () => {
      setLoading(true);
      let query = supabase.from("fabrics").select("*");

      // Logic:
      // Shop Fabric = Shows 'curtain' + 'shop-fabric' types
      // Sofa Fabric = Shows only 'sofa-fabric' types
      if (category === "shop-fabric") {
        query = query.in("category", ["curtain", "shop-fabric"]); 
      } else {
        query = query.eq("category", category);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) console.error("Error fetching fabrics:", error);
      else setFabrics(data || []);
      
      setLoading(false);
    };

    fetchFabrics();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => onNavigate("home")} className="mb-6 flex items-center text-gray-500 hover:text-indigo-600 transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500 mb-8">
        {category === "shop-fabric" 
          ? "Browse our complete collection. Purchase fabric by the meter." 
          : "Premium upholstery fabric. Enter your required meterage."}
      </p>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading fabrics...</div>
      ) : fabrics.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-gray-600 font-medium">No items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {fabrics.map((f) => (
            <div key={f.id} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={f.image_url || "https://via.placeholder.com/400x300"}
                  alt={f.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow">
                  ₹{f.price}/m
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{f.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-1">{f.description}</p>
                
                <div className="mt-auto">
                  {/* ✅ BOTH Categories now link to the Purchase Page */}
                  <button
                    onClick={() => onNavigate("buy-fabric-meter", f.id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-colors shadow-md ${
                      category === 'sofa-fabric' 
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {category === 'sofa-fabric' ? <Sofa className="w-4 h-4"/> : <Ruler className="w-4 h-4"/>}
                    {category === 'sofa-fabric' ? "Buy Upholstery" : "Buy Meterage"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}