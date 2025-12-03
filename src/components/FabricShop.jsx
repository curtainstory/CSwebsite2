import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FabricShop() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFabrics = async () => {
      const { data, error } = await supabase
        .from('fabrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching fabrics:', error);
      } else {
        setFabrics(data);
      }
      setLoading(false);
    };
    fetchFabrics();
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-500">Loading fabrics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Our Fabrics</h2>

      {fabrics.length === 0 ? (
        <div className="text-center text-gray-500 py-16">No fabrics found. Add some in Supabase!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {fabrics.map((f) => (
            <div key={f.id} className="bg-white border rounded-lg shadow hover:shadow-xl transition-all overflow-hidden">
              <div className="h-64 bg-gray-100">
                <img
                  src={f.image_url}
                  alt={f.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900">{f.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{f.description}</p>
                <p className="text-gray-800 font-semibold mt-3">
                  ₹{f.price_per_meter} <span className="text-sm text-gray-500">/ meter</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
