import prisma from "../../lib/prisma.js";
import type { AddCartItemInput, UpdateCartItemInput } from "./schema.js";

const cartInclude = {
  items: {
    include: { product: true },
  },
};

export async function getOrCreateCart(sessionId: string) {
  return prisma.cart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
    include: cartInclude,
  });
}
