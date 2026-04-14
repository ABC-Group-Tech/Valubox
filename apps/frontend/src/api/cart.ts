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

export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  const { data } = await apiClient.patch(`/api/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeCartItem(itemId: string): Promise<void> {
  await apiClient.delete(`/api/cart/items/${itemId}`);
}
