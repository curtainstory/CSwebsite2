import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ArrowLeft, Scissors, Ruler } from "lucide-react";

export default function CatalogueDetails({ catalogueId, onNavigate, mode = "stitch" }) {
  const [catalogue, setCatalogue] = useState(null);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!catalogueId) return;

      try {
        const [catResponse, fabResponse] = await Promise.all([
          supabase.from("catalogs").select("*").eq("id", catalogueId).single(),
          supabase.from("fabrics").select("*").eq("catalog_id", catalogueId),
        ]);

        if (catResponse.error) console.error("Catalogue Error:", catResponse.error);
        if (fabResponse.error) console.error("Fabrics Error:", fabResponse.error);

        setCatalogue(catResponse.data);
        setFabrics(fabResponse.data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [catalogueId]);

  if (loading) return <div className="text-center text-gray-500 py-20 text-lg">Loading collection...</div>;

  if (!catalogue)
    return (
      <div className="text-center text-gray-500 py-20">
        <h2 className="text-xl font-bold">Catalogue not found.</h2>
        <button onClick={() => onNavigate(mode === "shop" ? "shop-fabric" : "catalogues")} className="text-indigo-600 mt-4 underline">Return</button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button
        onClick={() => onNavigate(mode === "shop" ? "shop-fabric" : "catalogues")}
        className="mb-8 flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> {mode === "shop" ? "Back to Shop" : "Back to Collections"}
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 mb-12">
        <img
          src={catalogue.cover_image || "https://via.placeholder.com/400x300"}
          alt={catalogue.name}
          className="w-full md:w-1/3 h-64 object-cover rounded-xl shadow-md"
        />
        <div className="flex flex-col justify-center">
          <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-2">
            {mode === "shop" ? "Fabric Collection" : "Curtain Collection"}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{catalogue.name}</h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{catalogue.description}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-indigo-600 pl-4">
        Available Fabrics
      </h2>

      {fabrics.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No fabrics added to this catalogue yet.</p>
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
                  {f.design_code || "New"}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{f.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{f.description}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-700">₹{f.price}<span className="text-xs text-gray-400 font-normal">/meter</span></span>
                  
                  {mode === "shop" ? (
                    // ✅ SHOP MODE: Buy Meterage
                    <button
                      onClick={() => onNavigate("buy-fabric-meter", f.id)}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
                    >
                      <Ruler className="w-4 h-4" /> Buy Meter
                    </button>
                  ) : (
                    // ✅ STITCH MODE: Customize
                    <button
                      onClick={() => onNavigate("configure", f.id)}
                      className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors shadow-md"
                    >
                      <Scissors className="w-4 h-4" /> Customize
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}