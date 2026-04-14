import type { FastifyInstance } from "fastify";
import { createProductSchema, productListQuerySchema } from "./schema.js";
import { getProducts, getProductById, createProduct, deleteProduct } from "./service.js";

export default async function productRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const query = productListQuerySchema.parse(request.query);
    return getProducts(query);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await getProductById(id);
    if (!product) return reply.notFound("Product not found");
    return product;
  });

  app.post("/", async (request, reply) => {
    const body = createProductSchema.parse(request.body);
    const product = await createProduct(body);
    return reply.status(201).send(product);
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const product = await getProductById(id);
    if (!product) return reply.notFound("Product not found");
    try {
      await deleteProduct(id);
    } catch (err) {
      if (err instanceof Error && err.message === "PRODUCT_HAS_ORDERS") {
        return reply.conflict("주문 내역이 있는 상품은 삭제할 수 없습니다.");
      }
      throw err;
    }
    return reply.status(204).send();
  });
}
