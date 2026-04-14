import type { FastifyInstance } from "fastify";
import { createOrderSchema } from "./schema.js";
import { createOrder } from "./service.js";

export default async function orderRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const body = createOrderSchema.parse(request.body);
    try {
      const order = await createOrder(body);
      return reply.status(201).send(order);
    } catch (err) {
      if (err instanceof Error && err.message === "CART_EMPTY") {
        return reply.badRequest("Cart is empty or not found");
      }
      throw err;
    }
  });
}
