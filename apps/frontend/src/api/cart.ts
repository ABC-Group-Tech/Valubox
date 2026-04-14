import apiClient from "./client";
import type { Cart, CartItem } from "@/types";

export async function fetchCart(): Promise<Cart> {
  const { data } = await apiClient.get("/api/cart");
  return data;
}

export async function addToCart(productId: string, quantity = 1): Promise<CartItem> {
  const { data } = await apiClient.post("/api/cart/items", { productId, quantity });
  return data;
}
