import type { FastifyInstance } from "fastify";
import { createProductSchema, productListQuerySchema } from "./schema.js";
import { getProducts, getProductById, createProduct } from "./service.js";

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
}
