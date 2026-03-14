import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  editors_notes: string | null;
  image_url: string | null;
  hover_image_url: string | null;
  is_new: boolean | null;
  is_active: boolean | null;
}

export const useProducts = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*").eq("is_active", true);
      if (category && category !== "shop") {
        query = query.ilike("category", category);
      }
      const { data } = await query.order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  return { products, loading };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  return { product, loading };
};

export const formatPrice = (price: number) => `€${price.toLocaleString('en-EU', { minimumFractionDigits: 0 })}`;

// Map image paths from DB to actual imports
const imageMap: Record<string, string> = {};

// Dynamically import all images from assets
const assetModules = import.meta.glob('/src/assets/*.{jpg,jpeg,png,svg}', { eager: true, as: 'url' });

for (const [path, url] of Object.entries(assetModules)) {
  // Store with /assets/ prefix to match DB values
  const key = path.replace('/src', '');
  imageMap[key] = url;
}

export const resolveImageUrl = (dbPath: string | null): string => {
  if (!dbPath) return "/placeholder.svg";
  return imageMap[dbPath] || dbPath;
};
