import cors from "cors";
import "dotenv/config";
import express from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { batchesRouter } from "./modules/batches/batches.routes.js";
import { routesRouter } from "./modules/routes/routes.routes.js";
import { subscriptionsRouter } from "./modules/subscriptions/subscriptions.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";

const app = express();
const port = Number(process.env.PORT ?? 3333);

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "routesnap-backend" });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/batches", batchesRouter);
app.use("/routes", routesRouter);
app.use("/subscriptions", subscriptionsRouter);

app.listen(port, () => {
  console.log(`RouteSnap API listening on http://localhost:${port}`);
});
