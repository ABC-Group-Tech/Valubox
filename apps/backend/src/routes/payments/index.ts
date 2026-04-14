import type { FastifyInstance } from "fastify";
import { confirmPaymentSchema } from "./schema.js";
import { confirmPayment } from "./service.js";

export default async function paymentRoutes(app: FastifyInstance) {
  app.post("/confirm", async (request, reply) => {
    const body = confirmPaymentSchema.parse(request.body);
    try {
      const result = await confirmPayment(body);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "ORDER_NOT_FOUND") return reply.notFound("Order not found");
        if (err.message === "AMOUNT_MISMATCH") return reply.badRequest("Payment amount mismatch");
        if (err.message === "OUT_OF_STOCK") return reply.conflict("재고가 부족한 상품이 포함되어 있습니다.");
        return reply.internalServerError(err.message);
      }
      throw err;
    }
  });
}
