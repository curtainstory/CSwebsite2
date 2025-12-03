import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function CataloguesPage({ onNavigate, category }) {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogues = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("catalogues")
          .select("*")
          .order("created_at", { ascending: false });

        // 🔹 Filter by category if provided
        if (category) query = query.eq("category", category);

        const { data, error } = await query;

        if (error) throw error;
        setCatalogues(data || []);
      } catch (err) {
        console.error("Error fetching catalogues:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogues();
  }, [category]);

  // 🔹 Dynamic page title
  const getTitle = () => {
    switch (category) {
      case "stitch-curtain":
        return "Stitch Curtain Catalogues";
      case "shop-fabric":
        return "Curtain Fabric Collections";
      case "sofa-fabric":
        return "Sofa Fabric Collections";
      default:
        return "All Fabric Catalogues";
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{getTitle()}</h1>

      {catalogues.length === 0 ? (
        <p className="text-center text-gray-500">
          No catalogues found for this section.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogues.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate("catalogue-details", cat.id)}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={cat.image_url || "https://via.placeholder.com/400x300"}
                  alt={cat.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5 text-left">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {cat.description || "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
