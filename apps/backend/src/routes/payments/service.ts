import prisma from "../../lib/prisma.js";
import type { ConfirmPaymentInput } from "./schema.js";

export async function confirmPayment({ paymentKey, orderId, amount }: ConfirmPaymentInput) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (order.totalAmount !== amount) throw new Error("AMOUNT_MISMATCH");

  const secretKey = process.env.TOSS_SECRET_KEY ?? "";
  const credentials = Buffer.from(`${secretKey}:`).toString("base64");

  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!response.ok) {
    const error = await response.json() as { message: string };
    throw new Error(error.message);
  }

  const tossData = await response.json() as { paymentKey: string; totalAmount: number; status: string };

  await prisma.$transaction([
    prisma.payment.create({
      data: { orderId, paymentKey, amount, status: "DONE" },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    }),
  ]);

  return tossData;
}
