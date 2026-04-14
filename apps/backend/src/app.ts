import "dotenv/config";
import Fastify from "fastify";
import corsPlugin from "./plugins/cors.js";
import sensiblePlugin from "./plugins/sensible.js";
import productRoutes from "./routes/products/index.js";
import cartRoutes from "./routes/cart/index.js";
import orderRoutes from "./routes/orders/index.js";
import paymentRoutes from "./routes/payments/index.js";

const app = Fastify({ logger: true });

app.register(corsPlugin);
app.register(sensiblePlugin);

app.register(productRoutes, { prefix: "/api/products" });
app.register(cartRoutes, { prefix: "/api/cart" });
app.register(orderRoutes, { prefix: "/api/orders" });
app.register(paymentRoutes, { prefix: "/api/payments" });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 8000;
    await app.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
