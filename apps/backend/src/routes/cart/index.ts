import type { FastifyInstance } from "fastify";
import { addCartItemSchema, updateCartItemSchema } from "./schema.js";
import { getOrCreateCart, addCartItem, updateCartItem, removeCartItem } from "./service.js";

const SESSION_HEADER = "x-session-id";

export default async function cartRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const sessionId = request.headers[SESSION_HEADER] as string;
    if (!sessionId) return reply.badRequest("x-session-id header is required");
    return getOrCreateCart(sessionId);
  });

  app.post("/items", async (request, reply) => {
    const sessionId = request.headers[SESSION_HEADER] as string;
    if (!sessionId) return reply.badRequest("x-session-id header is required");
    const body = addCartItemSchema.parse(request.body);
    try {
      const item = await addCartItem(sessionId, body);
      return reply.status(201).send(item);
    } catch (err) {
      if (err instanceof Error && err.message === "OUT_OF_STOCK") {
        return reply.conflict("품절된 상품입니다.");
      }
      throw err;
    }
  });

  app.patch("/items/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateCartItemSchema.parse(request.body);
    return updateCartItem(id, body);
  });

  app.delete("/items/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await removeCartItem(id);
    return reply.status(204).send();
  });
}
