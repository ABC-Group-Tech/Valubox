import apiClient from "./client";
import type { Order } from "@/types";

export async function createOrder(cartId: string): Promise<Order> {
  const { data } = await apiClient.post("/api/orders", { cartId });
  return data;
}
