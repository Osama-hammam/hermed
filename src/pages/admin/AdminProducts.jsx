import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useProductStore } from "../../store";
import { categories } from "../../data/products";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../components/Pagination";

const EMPTY_FORM = {
  name: "",
  category: "handpieces",
  price: "",
  originalPrice: "",
  image: "",
  description: "",
  badge: "",
  inStock: true,
  stockCount: "",
  sku: "",
  features: "",
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  half,
  textarea,
}) => (
  <div className={half ? "col-span-1" : "col-span-2"}>
    <label className="block text-xs font-medium text-slate-600 mb-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="input text-sm resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="input text-sm"
      />
    )}
  </div>
);

export default function AdminProducts() {
  // Atomic selectors ensure clean reactivity and prevent unnecessary re-renders
  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);



  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;


  const filtered = useMemo(() => {
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.id - a.id);
  }, [products, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const handlePageChange = (p) => setPage(p);

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || "",
      image: p.image,
      description: p.description,
      badge: p.badge || "",
      inStock: p.inStock,
      stockCount: p.stockCount || 0,
      sku: p.sku || "",
      features: p.features?.join(", ") || "",
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If Supabase is configured, upload to storage
    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file, { upsert: true });
      
      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
        setForm((prev) => ({ ...prev, image: publicUrl }));
        toast.success('Image uploaded');
        return;
      }
    }

    // Fallback: use base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        setForm((prev) => ({ ...prev, image: dataUrl }));
      };
    };
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.image) return;

    const data = {
      ...form,
      price: parseFloat(form.price),
      stockCount: Math.max(0, parseInt(form.stockCount, 10) || 0),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      badge: form.badge || null,
      id: editId || Date.now(),
      slug: (form.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      inStock: (parseInt(form.stockCount, 10) || 0) > 0,
      features: form.features ? form.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
      rating: editId ? products.find((p) => p.id === editId)?.rating || 0 : 0,
      reviews: editId ? products.find((p) => p.id === editId)?.reviews || 0 : 0,
    };

    if (editId) {
      await updateProduct(editId, data);
      toast.success('Product updated');
    } else {
      await addProduct(data);
      toast.success('Product added');
    }
    closeForm();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
    toast.success('Product deleted');
  };

  const handleInputChange = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // تحديث حالة التوفر تلقائياً بناءً على الكمية
      if (name === "stockCount") {
        next.inStock = (parseInt(value, 10) || 0) > 0;
      }
      return next;
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Products
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {products.length} total products
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 max-w-md"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">
                  Product
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">
                  Category
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">
                  Price
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=dbeafe&color=1d4ed8&size=40`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {p.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-600">
                    {p.category}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900">
                      EGP {p.price.toFixed(2)}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">
                        EGP {p.originalPrice}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-slate-500 mb-1">
                      {p.stockCount} items available
                    </div>
                    <span
                      className={`badge ${p.stockCount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
                    >
                      {p.stockCount > 0 ? "In Stock" : "Sold Out"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs font-medium text-brand-500 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No products match your search.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800 text-lg">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Product Name *"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="NSK Ti-Max Z95L"
                />
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="input text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Badge
                  </label>
                  <select
                    value={form.badge}
                    onChange={(e) =>
                      setForm({ ...form, badge: e.target.value })
                    }
                    className="input text-sm"
                  >
                    <option value="">None</option>
                    {[
                      "Best Seller",
                      "New",
                      "Sale",
                      "Premium",
                      "Professional",
                    ].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <FormField
                  label="Price (EGP) *"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="299.00"
                  half
                />
                <FormField
                  label="Original Price (EGP)"
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="349.00"
                  half
                />
                <FormField
                  label="SKU"
                  name="sku"
                  value={form.sku}
                  onChange={handleInputChange}
                  placeholder="NSK-Z95L"
                  half
                />
                <FormField
                  label="Inventory Level (stockCount) *"
                  name="stockCount"
                  value={form.stockCount}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="10"
                  half
                />

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Product Image *
                  </label>
                  {form.image ? (
                    <div className="relative group w-full aspect-video rounded-xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-50 transition-colors">
                          Change Image
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                        <button
                          onClick={() => setForm({ ...form, image: "" })}
                          className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand-300 cursor-pointer transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <ArrowUpTrayIcon className="w-6 h-6 text-brand-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          Click to upload product image
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG or WEBP (Max. 2MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                <FormField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Product description..."
                  textarea
                />
                <FormField
                  label="Features (comma separated)"
                  name="features"
                  value={form.features}
                  onChange={handleInputChange}
                  placeholder="LED illumination, Autoclavable, ..."
                />

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={form.inStock}
                    onChange={(e) =>
                      setForm({ ...form, inStock: e.target.checked })
                    }
                    className="w-4 h-4 accent-brand-500"
                  />
                  <label
                    htmlFor="inStock"
                    className="text-sm font-medium text-slate-700"
                  >
                    In Stock
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={handleSave}
                  disabled={!form.name || !form.price || !form.image}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editId ? "Save Changes" : "Add Product"}
                </button>
                <button onClick={closeForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone. The product will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
