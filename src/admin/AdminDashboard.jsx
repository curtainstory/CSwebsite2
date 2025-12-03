import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FabricForm from "./FabricForm";
import AdminCatalogues from "./AdminCatalogues";
import AdminCategories from "./AdminCategories";
import AdminHomeManager from "./AdminHomeManager";
import AdminHeroManager from "./AdminHeroManager";

import {
  LayoutDashboard,
  Layers,
  FolderOpen,
  Home,
  Image as ImageIcon,
  LogOut,
  PlusCircle,
  Trash2,
  Edit3,
  Loader2,
} from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [view, setView] = useState("fabrics");
  const [fabrics, setFabrics] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [{ data: fabricData }, { data: catalogueData }] = await Promise.all([
        supabase.from("fabrics").select("*").order("created_at", { ascending: false }),
        supabase.from("catalogues").select("*").order("created_at", { ascending: false }),
      ]);
      setFabrics(fabricData || []);
      setCatalogues(catalogueData || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save Fabric
  const handleSave = async (fabric) => {
    try {
      const clean = Object.fromEntries(
        Object.entries(fabric).filter(([_, v]) => v !== undefined && v !== "")
      );
      if (fabric.id) {
        await supabase.from("fabrics").update(clean).eq("id", fabric.id);
      } else {
        clean.created_at = new Date().toISOString();
        await supabase.from("fabrics").insert([clean]);
      }
      alert("✅ Fabric saved successfully!");
      setAdding(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save fabric.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Delete this fabric permanently?")) return;
    try {
      setDeletingId(id);
      await supabase.from("fabrics").delete().eq("id", id);
      setFabrics((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // View Switchers
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
        <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading Dashboard...
      </div>
    );

  if (view === "catalogues") return <AdminCatalogues onBack={() => setView("fabrics")} />;
  if (view === "categories") return <AdminCategories onBack={() => setView("fabrics")} />;
  if (view === "home") return <AdminHomeManager onBack={() => setView("fabrics")} />;
  if (view === "hero") return <AdminHeroManager onBack={() => setView("fabrics")} />;

  if (adding || editing)
    return (
      <FabricForm
        initialData={editing || {}}
        catalogues={catalogues}
        onSave={handleSave}
        onCancel={() => {
          setAdding(false);
          setEditing(null);
        }}
      />
    );

  // 🎨 Beautiful Dashboard Layout
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-lg border-r border-indigo-100 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" /> Admin Panel
          </h1>

          <nav className="space-y-2">
            <button
              onClick={() => setView("fabrics")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                view === "fabrics"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              <Layers className="w-4 h-4" /> Fabrics
            </button>

            <button
              onClick={() => setView("catalogues")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                view === "catalogues"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              <FolderOpen className="w-4 h-4" /> Catalogues
            </button>

            <button
              onClick={() => setView("categories")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                view === "categories"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              <Home className="w-4 h-4" /> Categories
            </button>

            <button
              onClick={() => setView("home")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                view === "home"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              <Home className="w-4 h-4" /> Manage Home
            </button>

            <button
              onClick={() => setView("hero")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                view === "hero"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Hero Section
            </button>
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Manage Fabrics
          </h2>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
          >
            <PlusCircle className="w-4 h-4" /> Add Fabric
          </button>
        </div>

        {/* Table */}
        {fabrics.length === 0 ? (
          <div className="text-center py-16 text-gray-400 border border-dashed rounded-xl bg-white/60">
            No fabrics found — click “Add Fabric” to create one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-md border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-indigo-50 border-b border-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Catalogue</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fabrics.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b hover:bg-indigo-50/50 transition cursor-pointer"
                    onClick={() => setEditing(f)}
                  >
                    <td className="p-3">
                      {f.image_url ? (
                        <img
                          src={f.image_url}
                          alt={f.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs italic">No image</span>
                      )}
                    </td>
                    <td className="p-3 font-medium text-gray-800">{f.name}</td>
                    <td className="p-3 text-gray-600">
                      {catalogues.find((c) => c.id === f.catalogue_id)?.name || "-"}
                    </td>
                    <td className="p-3 text-gray-600">{f.category}</td>
                    <td className="p-3 text-gray-800">₹{f.price_per_meter || "-"}</td>
                    <td
                      className="p-3 space-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setEditing(f)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        disabled={deletingId === f.id}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        {deletingId === f.id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
