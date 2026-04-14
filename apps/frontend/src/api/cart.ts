import apiClient from "./client";
import type { Cart, CartItem } from "@/types";

export async function fetchCart(): Promise<Cart> {
  const { data } = await apiClient.get("/api/cart");
  return data;
}
