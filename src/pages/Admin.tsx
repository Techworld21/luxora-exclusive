import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Pencil } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { navigate("/auth"); return; }
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!data) { navigate("/"); toast({ title: "Access denied", variant: "destructive" }); return; }
      setIsAdmin(true);
      setLoading(false);
    };
    checkAdmin();
  }, [user, navigate, toast]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (editingProduct.id) {
      await supabase.from("products").update({
        name: editingProduct.name!,
        category: editingProduct.category!,
        price: editingProduct.price!,
        description: editingProduct.description,
        material: editingProduct.material,
        is_new: editingProduct.is_new,
        is_active: editingProduct.is_active,
      }).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert({
        name: editingProduct.name!,
        category: editingProduct.category!,
        price: editingProduct.price!,
        description: editingProduct.description,
        material: editingProduct.material,
        is_new: editingProduct.is_new ?? false,
        is_active: editingProduct.is_active ?? true,
      });
    }
    toast({ title: "Product saved" });
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  if (loading) return <div className="min-h-screen bg-background"><Header /><div className="flex items-center justify-center py-24"><p>Loading...</p></div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-light text-foreground">Product Management</h1>
          <Button onClick={() => setEditingProduct({ name: "", category: "Earrings", price: 0, is_new: false, is_active: true })} className="rounded-none">
            <Plus size={16} className="mr-2" /> Add Product
          </Button>
        </div>

        {editingProduct && (
          <div className="border border-border p-6 mb-8 space-y-4">
            <h2 className="text-lg font-light">{editingProduct.id ? "Edit" : "New"} Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Name" value={editingProduct.name || ""} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="rounded-none" />
              <Input placeholder="Category" value={editingProduct.category || ""} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="rounded-none" />
              <Input type="number" placeholder="Price" value={editingProduct.price || ""} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="rounded-none" />
              <Input placeholder="Material" value={editingProduct.material || ""} onChange={e => setEditingProduct({ ...editingProduct, material: e.target.value })} className="rounded-none" />
              <Input placeholder="Description" value={editingProduct.description || ""} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="rounded-none" />
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 text-sm font-light">
                <input type="checkbox" checked={editingProduct.is_new ?? false} onChange={e => setEditingProduct({ ...editingProduct, is_new: e.target.checked })} /> New
              </label>
              <label className="flex items-center gap-2 text-sm font-light">
                <input type="checkbox" checked={editingProduct.is_active ?? true} onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })} /> Active
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="rounded-none">Save</Button>
              <Button variant="outline" onClick={() => setEditingProduct(null)} className="rounded-none">Cancel</Button>
            </div>
          </div>
        )}

        <div className="border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-light text-muted-foreground">Name</th>
                <th className="text-left p-3 text-sm font-light text-muted-foreground">Category</th>
                <th className="text-left p-3 text-sm font-light text-muted-foreground">Price</th>
                <th className="text-left p-3 text-sm font-light text-muted-foreground">Status</th>
                <th className="text-right p-3 text-sm font-light text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-sm font-light">{product.name}</td>
                  <td className="p-3 text-sm font-light text-muted-foreground">{product.category}</td>
                  <td className="p-3 text-sm font-light">€{product.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                    {product.is_new && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 ml-1">New</span>}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEditingProduct(product)} className="p-1 text-muted-foreground hover:text-foreground mr-2"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
