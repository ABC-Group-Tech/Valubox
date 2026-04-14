import prisma from "../../lib/prisma.js";
import type { CreateOrderInput } from "./schema.js";

export async function createOrder({ cartId }: CreateOrderInput) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("CART_EMPTY");
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      totalAmount,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return order;
}
