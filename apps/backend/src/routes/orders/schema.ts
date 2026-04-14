import { z } from "zod";

export const createOrderSchema = z.object({
  cartId: z.string().uuid(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
