import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function CatalogueDetails({ catalogueId, onNavigate }) {
  const [catalogue, setCatalogue] = useState(null);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const [{ data: catData, error: catErr }, { data: fabData, error: fabErr }] =
        await Promise.all([
          supabase.from("catalogues").select("*").eq("id", catalogueId).single(),
          supabase.from("fabrics").select("*").eq("catalogue_id", catalogueId),
        ]);

      if (catErr) console.error("Catalogue fetch error:", catErr);
      if (fabErr) console.error("Fabrics fetch error:", fabErr);

      setCatalogue(catData);
      setFabrics(fabData || []);
      setLoading(false);
    };

    fetchDetails();
  }, [catalogueId]);

  if (loading)
    return <div className="text-center text-gray-500 py-10">Loading...</div>;

  if (!catalogue)
    return (
      <div className="text-center text-gray-500 py-10">
        Catalogue not found.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => onNavigate("catalogues")}
        className="mb-6 text-indigo-600 hover:underline"
      >
        ← Back to all catalogues
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <img
          src={catalogue.image_url || "https://via.placeholder.com/400x300"}
          alt={catalogue.name}
          className="w-full md:w-1/3 h-56 object-cover rounded-lg border"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{catalogue.name}</h1>
          <p className="text-gray-600 mt-2">{catalogue.description}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Fabrics in this Catalogue</h2>

      {fabrics.length === 0 ? (
        <p className="text-gray-500">No fabrics yet in this catalogue.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fabrics.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-lg border shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <img
                src={f.image_url || "https://via.placeholder.com/400x300"}
                alt={f.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{f.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {f.description}
                </p>
                <p className="text-indigo-600 font-medium mt-2">
                  ₹{f.price_per_meter} / meter
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
