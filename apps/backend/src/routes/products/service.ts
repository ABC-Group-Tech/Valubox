import prisma from "../../lib/prisma.js";
import type { CreateProductInput, ProductListQuery } from "./schema.js";

export async function getProducts({ page, limit }: ProductListQuery) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.product.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.product.count(),
  ]);
  return { data, total, page, limit };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}
