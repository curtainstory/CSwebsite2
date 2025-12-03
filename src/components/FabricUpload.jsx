import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FabricUpload() {
  const [fabric, setFabric] = useState({
    name: '',
    price_per_meter: '',
    type: '',
    category: 'Curtain',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");
    setLoading(true);

    // Upload image to storage
    const fileName = `${Date.now()}-${image.name}`;
    const { data: imageData, error: uploadError } = await supabase.storage
      .from('fabric-images')
      .upload(fileName, image);

    if (uploadError) {
      console.error(uploadError);
      alert('Image upload failed');
      setLoading(false);
      return;
    }

    const imageUrl = `${supabase.storage.from('fabric-images').getPublicUrl(fileName).data.publicUrl}`;

    // Insert record into DB
    const { error: dbError } = await supabase.from('fabrics').insert([
      { ...fabric, price_per_meter: Number(fabric.price_per_meter), image_url: imageUrl }
    ]);

    if (dbError) {
      console.error(dbError);
      alert('Database insert failed');
    } else {
      alert('Fabric added successfully!');
      setFabric({ name: '', price_per_meter: '', type: '', category: 'Curtain', description: '' });
      setImage(null);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpload} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Upload New Fabric</h2>

      <input className="border p-2 w-full" placeholder="Fabric Name" value={fabric.name}
        onChange={e => setFabric({ ...fabric, name: e.target.value })} required />

      <input className="border p-2 w-full" type="number" placeholder="Price per meter"
        value={fabric.price_per_meter} onChange={e => setFabric({ ...fabric, price_per_meter: e.target.value })} required />

      <input className="border p-2 w-full" placeholder="Type (e.g. Linen, Velvet)"
        value={fabric.type} onChange={e => setFabric({ ...fabric, type: e.target.value })} />

      <select className="border p-2 w-full" value={fabric.category}
        onChange={e => setFabric({ ...fabric, category: e.target.value })}>
        <option value="Curtain">Curtain</option>
        <option value="Sofa">Sofa</option>
      </select>

      <textarea className="border p-2 w-full" placeholder="Description"
        value={fabric.description} onChange={e => setFabric({ ...fabric, description: e.target.value })} />

      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <button disabled={loading} className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700">
        {loading ? 'Uploading...' : 'Upload Fabric'}
      </button>
    </form>
  );
}
