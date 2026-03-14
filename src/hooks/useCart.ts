import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    image_url: string | null;
  };
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, products(id, name, category, price, image_url)")
      .eq("user_id", user.id);

    if (data) {
      setCartItems(data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.products,
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) return;
    const existing = cartItems.find(i => i.product_id === productId);
    if (existing) {
      await supabase.from("cart_items").update({ quantity: existing.quantity + quantity }).eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({ user_id: user.id, product_id: productId, quantity });
    }
    await fetchCart();
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await supabase.from("cart_items").delete().eq("id", cartItemId);
    } else {
      await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", cartItemId);
    }
    await fetchCart();
  };

  const removeFromCart = async (cartItemId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    await fetchCart();
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return { cartItems, loading, addToCart, updateQuantity, removeFromCart, cartCount, subtotal, fetchCart };
};
