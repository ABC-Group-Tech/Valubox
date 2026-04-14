import { z } from "zod";

export const confirmPaymentSchema = z.object({
  paymentKey: z.string().min(1),
  orderId: z.string().uuid(),
  amount: z.number().int().positive(),
});

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
