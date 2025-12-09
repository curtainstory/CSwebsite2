import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Trash2, RefreshCw, Image as ImageIcon, Home, Grid, Layers, Scissors, Info, Package, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("orders"); // ✅ Start with Orders
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 📦 Data State
  const [orders, setOrders] = useState([]); // New Orders State
  const [catalogs, setCatalogs] = useState([]);
  const [homeCurated, setHomeCurated] = useState([]);
  const [homeFeatured, setHomeFeatured] = useState([]);
  const [banners, setBanners] = useState([]);
  const [fabricsList, setFabricsList] = useState([]); 
  
  // Expanded Order State
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // 📝 Form States
  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "", section: "home_hero", file: null, imageUrlInput: "" });
  const [catalogForm, setCatalogForm] = useState({ name: "", description: "", file: null, imageUrlInput: "" });
  
  // Fabric Form with Width
  const [fabricForm, setFabricForm] = useState({ 
    name: "", 
    price: "", 
    width: "54", 
    category: "curtain", 
    catalog_id: "", 
    design_code: "", 
    file: null, 
    imageUrlInput: "" 
  });
  
  const [curatedForm, setCuratedForm] = useState({ title: "", description: "", file: null, imageUrlInput: "" });
  const [featuredForm, setFeaturedForm] = useState({ title: "", price: "", file: null, imageUrlInput: "" });

  // 🔄 Initial Data Fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchHomeContent(), fetchCatalogs(), fetchBanners(), fetchFabrics()]);
    setLoading(false);
  };

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
  };

  const fetchHomeContent = async () => {
    const { data: cData } = await supabase.from("home_curated").select("*").order("created_at", { ascending: false });
    const { data: fData } = await supabase.from("home_featured").select("*").order("created_at", { ascending: false });
    setHomeCurated(cData || []);
    setHomeFeatured(fData || []);
  };

  const fetchCatalogs = async () => {
    const { data } = await supabase.from("catalogs").select("*").order('created_at', { ascending: false });
    setCatalogs(data || []);
  };

  const fetchBanners = async () => {
    const { data } = await supabase.from("site_assets").select("*").eq("section", "home_hero");
    setBanners(data || []);
  };

  const fetchFabrics = async () => {
    const { data } = await supabase
      .from("fabrics")
      .select(`*, catalogs ( name )`)
      .order('created_at', { ascending: false })
      .limit(50);
    setFabricsList(data || []);
  };

  // Update Order Status
  const updateOrderStatus = async (id, newStatus) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    fetchOrders(); // Refresh list to reflect changes
  };

  // 📤 Generic Image Helper (File OR URL)
  const getFinalImageUrl = async (file, urlInput, bucket) => {
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
    } else if (urlInput && urlInput.trim() !== "") {
      return urlInput.trim();
    }
    return null;
  };

  // 🗑️ Delete Helper
  const deleteItem = async (table, id, name = "Item") => {
    if(!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    else {
      fetchAllData(); 
      setMessage(`${name} deleted successfully.`);
    }
  };

  /* --- SUBMIT HANDLERS --- */
  const handleCuratedSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const url = await getFinalImageUrl(curatedForm.file, curatedForm.imageUrlInput, "banners");
      if (!url) throw new Error("Image required");
      await supabase.from("home_curated").insert([{ title: curatedForm.title, description: curatedForm.description, image_url: url }]);
      setMessage("Added to Home Page Curated!");
      setCuratedForm({ title: "", description: "", file: null, imageUrlInput: "" });
      fetchHomeContent();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleFeaturedSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const url = await getFinalImageUrl(featuredForm.file, featuredForm.imageUrlInput, "banners");
      if (!url) throw new Error("Image required");
      await supabase.from("home_featured").insert([{ title: featuredForm.title, price: featuredForm.price, image_url: url }]);
      setMessage("Added to Home Page Featured!");
      setFeaturedForm({ title: "", price: "", file: null, imageUrlInput: "" });
      fetchHomeContent();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const finalUrl = await getFinalImageUrl(bannerForm.file, bannerForm.imageUrlInput, "banners");
      if (!finalUrl) throw new Error("Image required");
      await supabase.from("site_assets").delete().eq("section", "home_hero");
      await supabase.from("site_assets").insert([{ title: bannerForm.title, subtitle: bannerForm.subtitle, section: "home_hero", image_url: finalUrl }]);
      setMessage("Home Hero updated!");
      setBannerForm({ title: "", subtitle: "", section: "home_hero", file: null, imageUrlInput: "" });
      fetchBanners();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleCatalogSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const finalUrl = await getFinalImageUrl(catalogForm.file, catalogForm.imageUrlInput, "products");
      if (!finalUrl) throw new Error("Image required");
      await supabase.from("catalogs").insert([{ name: catalogForm.name, description: catalogForm.description, cover_image: finalUrl }]);
      setMessage("Catalogue created!");
      setCatalogForm({ name: "", description: "", file: null, imageUrlInput: "" });
      fetchCatalogs(); 
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleFabricSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const finalUrl = await getFinalImageUrl(fabricForm.file, fabricForm.imageUrlInput, "products");
      if (!finalUrl) throw new Error("Image required");
      
      const payload = {
        name: fabricForm.name,
        price: parseFloat(fabricForm.price),
        width: parseFloat(fabricForm.width) || 54, // ✅ Width
        category: fabricForm.category,
        image_url: finalUrl,
        design_code: fabricForm.design_code,
        catalog_id: (fabricForm.category === "curtain" && fabricForm.catalog_id) ? parseInt(fabricForm.catalog_id) : null
      };

      await supabase.from("fabrics").insert([payload]);
      setMessage("Inventory Item Uploaded!");
      setFabricForm({ name: "", price: "", width: "54", category: "curtain", catalog_id: "", design_code: "", file: null, imageUrlInput: "" });
      fetchFabrics();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  // Reusable Image Input
  const ImageInputGroup = ({ formState, setFormState }) => (
    <div className="bg-gray-50 p-3 rounded border border-gray-200">
      <label className="block text-xs font-bold text-gray-700 mb-2">Image Source</label>
      <input type="text" className="w-full border p-2 rounded text-sm mb-2" placeholder="Paste Image URL..." value={formState.imageUrlInput} onChange={e => setFormState({...formState, imageUrlInput: e.target.value})} />
      <div className="text-center text-xs text-gray-400 font-bold mb-2">- OR -</div>
      <input type="file" className="text-sm w-full" onChange={e => setFormState({...formState, file: e.target.files[0]})} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl z-10 flex flex-col fixed h-full border-r border-gray-200">
        <div className="p-6 border-b bg-gray-50">
           <h2 className="text-2xl font-extrabold text-indigo-700 tracking-tight">Curtain Story</h2>
           <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[ 
            { id: "orders", label: "📦 Orders", icon: Package },
            { id: "home-setup", label: "🏠 Home Visuals", icon: Home },
            { id: "banners", label: "📸 Home Banners", icon: ImageIcon },
            { id: "catalogs", label: "📚 Catalogues", icon: Grid },
            { id: "fabrics", label: "🧵 Inventory", icon: Scissors }
          ].map((tab) => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
               className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3 ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
               <tab.icon size={18} /> {tab.label}
             </button>
          ))}
        </nav>
        <div className="p-4 border-t bg-gray-50"><button onClick={onLogout} className="w-full py-2 text-red-600 hover:bg-red-50 rounded text-sm font-bold">Log Out</button></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 ml-64 overflow-y-auto min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize flex items-center gap-2">
            {activeTab === "home-setup" ? "🏠 Home Page Visuals" : activeTab === "fabrics" ? "🧵 Inventory" : activeTab.replace("-", " ")}
          </h1>
          <button onClick={fetchAllData} className="flex items-center gap-2 text-sm text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded transition font-medium"><RefreshCw size={16}/> Refresh Data</button>
        </div>
        
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 shadow-sm flex justify-between animate-fade-in">
            <span className="font-medium">{message}</span>
            <button onClick={() => setMessage("")} className="text-green-800 font-bold hover:text-green-900">&times;</button>
          </div>
        )}

        {/* --- TAB 0: ORDERS --- */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? <p className="text-gray-500 text-center py-20">No orders yet.</p> : orders.map(order => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                    <div className="flex gap-4 items-center">
                      <div className={`p-2 rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}><Package size={20} /></div>
                      <div><h4 className="font-bold text-gray-900">{order.customer_name}</h4><p className="text-sm text-gray-500">{order.customer_phone}</p></div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right"><p className="font-bold text-lg">₹{order.total_amount}</p><p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p></div>
                      <select onClick={(e) => e.stopPropagation()} value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`text-sm font-bold py-1 px-3 rounded border ${order.status === 'Pending' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'}`}>
                        <option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
                      </select>
                      {expandedOrderId === order.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>
                  
                  {/* Order Items (Expanded) */}
                  {expandedOrderId === order.id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-3">
                      <h5 className="text-xs font-bold text-gray-500 uppercase">Order Items</h5>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white p-3 rounded border border-gray-200">
                          <img src={item.image_url} className="w-12 h-12 rounded object-cover bg-gray-200" alt="product" />
                          <div>
                            <p className="font-bold text-sm text-gray-900">{item.name}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.headerStyle ? (
                                <div className="flex flex-col gap-1">
                                  <span className="text-indigo-600 font-medium">✂️ Custom: {item.headerStyle}</span>
                                  <span>📏 Size: <strong>{item.dimensions?.width} x {item.dimensions?.height} {item.unit}</strong></span>
                                  <span>🪟 Panels: {item.quantity} | Ring: {item.ringType || 'N/A'}</span>
                                </div>
                              ) : item.type === 'meterage' ? (
                                <span className="text-green-600 font-medium">🧵 Fabric: {item.quantity} meters</span>
                              ) : (
                                <span className="text-orange-600 font-medium">📦 Qty: {item.quantity}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            ))}
          </div>
        )}

        {/* --- TAB 1: HOME PAGE SETUP --- */}
        {activeTab === "home-setup" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">1. Curated Slider (Visuals Only)</h3>
              <form onSubmit={handleCuratedSubmit} className="space-y-4 mb-6">
                <input type="text" placeholder="Title" className="w-full border p-2 rounded" value={curatedForm.title} onChange={e => setCuratedForm({...curatedForm, title: e.target.value})} />
                <input type="text" placeholder="Description" className="w-full border p-2 rounded" value={curatedForm.description} onChange={e => setCuratedForm({...curatedForm, description: e.target.value})} />
                <ImageInputGroup formState={curatedForm} setFormState={setCuratedForm} />
                <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">{loading ? "..." : "Add Slide"}</button>
              </form>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                 {homeCurated.map(item => (
                   <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-gray-50">
                     <img src={item.image_url} className="w-12 h-12 object-cover rounded" /><div className="flex-1"><p className="font-bold text-sm">{item.title}</p></div>
                     <button onClick={() => deleteItem("home_curated", item.id, item.title)} className="text-red-500 hover:bg-red-100 p-2 rounded transition"><Trash2 size={16}/></button>
                   </div>
                 ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">2. Featured Grid (Visuals Only)</h3>
              <form onSubmit={handleFeaturedSubmit} className="space-y-4 mb-6">
                <input type="text" placeholder="Title" className="w-full border p-2 rounded" value={featuredForm.title} onChange={e => setFeaturedForm({...featuredForm, title: e.target.value})} />
                <input type="text" placeholder="Price Label" className="w-full border p-2 rounded" value={featuredForm.price} onChange={e => setFeaturedForm({...featuredForm, price: e.target.value})} />
                <ImageInputGroup formState={featuredForm} setFormState={setFeaturedForm} />
                <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">{loading ? "..." : "Add Card"}</button>
              </form>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                 {homeFeatured.map(item => (
                   <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-gray-50">
                     <img src={item.image_url} className="w-12 h-12 object-cover rounded" /><div className="flex-1"><p className="font-bold text-sm">{item.title}</p></div>
                     <button onClick={() => deleteItem("home_featured", item.id, item.title)} className="text-red-500 hover:bg-red-100 p-2 rounded transition"><Trash2 size={16}/></button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: BANNERS --- */}
        {activeTab === "banners" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Update Home Hero</h3>
              <form onSubmit={handleBannerSubmit} className="space-y-4">
                <input type="text" placeholder="Main Title" className="w-full border p-2.5 rounded" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} />
                <input type="text" placeholder="Subtitle" className="w-full border p-2.5 rounded" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} />
                <ImageInputGroup formState={bannerForm} setFormState={setBannerForm} />
                <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">{loading ? "Processing..." : "Save Banner"}</button>
              </form>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Current Banner</h3>
                {banners.length === 0 ? <p className="text-gray-400 italic">No banner active.</p> : banners.map(b => (
                    <div key={b.id} className="relative group rounded-lg overflow-hidden border border-gray-300">
                      <img src={b.image_url} alt="hero" className="w-full h-48 object-cover" />
                      <div className="bg-white p-3"><p className="font-bold text-gray-900">{b.title}</p><p className="text-sm text-gray-500">{b.subtitle}</p></div>
                      <button onClick={() => deleteItem("site_assets", b.id, "Hero Banner")} className="absolute top-2 right-2 bg-white text-red-600 p-2 rounded-full shadow hover:bg-red-50 transition"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: CATALOGUES --- */}
        {activeTab === "catalogs" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Create New Catalogue</h3>
              <form onSubmit={handleCatalogSubmit} className="space-y-4">
                <input type="text" required className="w-full border p-2.5 rounded" placeholder="Catalogue Name" value={catalogForm.name} onChange={e => setCatalogForm({...catalogForm, name: e.target.value})} />
                <textarea rows="3" className="w-full border p-2.5 rounded" placeholder="Description..." value={catalogForm.description} onChange={e => setCatalogForm({...catalogForm, description: e.target.value})} />
                <ImageInputGroup formState={catalogForm} setFormState={setCatalogForm} />
                <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">{loading ? "Creating..." : "Create Catalogue"}</button>
              </form>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Existing Catalogues</h3>
              <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {catalogs.map(cat => (
                  <li key={cat.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition">
                    <img src={cat.cover_image || "https://via.placeholder.com/50"} alt="cover" className="w-14 h-14 object-cover rounded bg-gray-100" />
                    <div className="flex-1"><h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4><p className="text-xs text-gray-500 truncate">{cat.description}</p></div>
                    <button onClick={() => deleteItem("catalogs", cat.id, cat.name)} className="text-red-500 hover:bg-red-100 p-2 rounded transition"><Trash2 size={18}/></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* --- TAB 4: FABRICS (INVENTORY) --- */}
        {activeTab === "fabrics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Upload Inventory</h3>
              <form onSubmit={handleFabricSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Item Category</label>
                  <select className="w-full border p-2.5 rounded bg-white" value={fabricForm.category} onChange={e => setFabricForm({...fabricForm, category: e.target.value})}>
                    <option value="curtain">Curtain Fabric (Appears in Stitch & Shop)</option>
                    <option value="shop-fabric">Loose Fabric (Appears in Shop Only)</option>
                    <option value="sofa-fabric">Sofa Fabric (Appears in Sofa Only)</option>
                  </select>
                </div>
                {fabricForm.category === "curtain" && (
                  <div className="p-3 bg-indigo-50 rounded border border-indigo-100">
                    <label className="block text-indigo-800 mb-1 font-bold text-xs">Assign to Catalogue</label>
                    <select className="w-full border border-indigo-200 p-2 rounded bg-white" required value={fabricForm.catalog_id} onChange={e => setFabricForm({...fabricForm, catalog_id: e.target.value})}>
                      <option value="">-- Select Catalogue --</option>
                      {catalogs.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="Name" className="border p-2.5 rounded" value={fabricForm.name} onChange={e => setFabricForm({...fabricForm, name: e.target.value})} />
                  <input type="text" placeholder="Code (e.g. #A1)" className="border p-2.5 rounded" value={fabricForm.design_code} onChange={e => setFabricForm({...fabricForm, design_code: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" required placeholder="Price (₹)" className="w-full border p-2.5 rounded" value={fabricForm.price} onChange={e => setFabricForm({...fabricForm, price: e.target.value})} />
                  <select className="w-full border p-2.5 rounded bg-white" value={fabricForm.width} onChange={e => setFabricForm({...fabricForm, width: e.target.value})}>
                    <option value="48">48 inches</option><option value="54">54 inches (Standard)</option><option value="60">60 inches</option><option value="72">72 inches</option><option value="110">110 inches</option>
                  </select>
                </div>
                <ImageInputGroup formState={fabricForm} setFormState={setFabricForm} />
                <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">{loading ? "Uploading..." : "Add to Inventory"}</button>
              </form>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
                <span>Recent Inventory</span><span className="text-xs font-normal text-gray-500">Last 50 items</span>
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {fabricsList.length === 0 ? <p className="text-gray-400 italic">No inventory uploaded yet.</p> : fabricsList.map(f => (
                  <div key={f.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 bg-white transition">
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                       {f.image_url ? <img src={f.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 m-3 text-gray-400"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{f.name}</h4>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 items-center mt-1">
                        <span className={`px-2 py-0.5 rounded ${f.category === 'sofa-fabric' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          {f.category === 'curtain' ? 'Stitch & Shop' : f.category === 'sofa-fabric' ? 'Sofa' : 'Shop Only'}
                        </span>
                        {f.catalogs && <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">Cat: {f.catalogs.name}</span>}
                        <span className="font-medium text-gray-900">₹{f.price}/m</span>
                        <span className="bg-gray-100 border px-1.5 py-0.5 rounded text-gray-600">W: {f.width}"</span>
                      </div>
                    </div>
                    <button onClick={() => deleteItem("fabrics", f.id, f.name)} className="text-red-500 hover:bg-red-100 p-2 rounded transition"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}