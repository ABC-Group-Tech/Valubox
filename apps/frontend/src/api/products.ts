import apiClient from "./client";
import type { Product, ProductListResponse } from "@/types";

export async function fetchProducts(page = 1, limit = 20): Promise<ProductListResponse> {
  const { data } = await apiClient.get("/api/products", { params: { page, limit } });
  return data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get(`/api/products/${id}`);
  return data;
}
