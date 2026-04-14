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

export async function addCartItem(sessionId: string, { productId, quantity }: AddCartItemInput) {
  const cart = await getOrCreateCart(sessionId);
  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity },
    include: { product: true },
  });
}
