import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { signToken } from "../../common/auth.js";
import { prisma } from "../../prisma/client.js";

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post("/register", async (req, res) => {
  const body = credentialsSchema
    .extend({
      name: z.string().min(2)
    })
    .safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ message: "Dados inválidos.", issues: body.error.issues });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: body.data.email } });

  if (existingUser) {
    return res.status(409).json({ message: "E-mail já cadastrado." });
  }

  const passwordHash = await bcrypt.hash(body.data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: body.data.name,
      email: body.data.email,
      passwordHash,
      plan: "FREE"
    }
  });

  return res.status(201).json({
    token: signToken({ id: user.id, plan: user.plan }),
    user: sanitizeUser(user)
  });
});

authRouter.post("/login", async (req, res) => {
  const body = credentialsSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ message: "Dados inválidos.", issues: body.error.issues });
  }

  const user = await prisma.user.findUnique({ where: { email: body.data.email } });
  const passwordMatches = user
    ? await bcrypt.compare(body.data.password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  return res.json({
    token: signToken({ id: user.id, plan: user.plan }),
    user: sanitizeUser(user)
  });
});

function sanitizeUser(user: { id: string; name: string; email: string; plan: "FREE" | "VIP" }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    isVip: user.plan === "VIP"
  };
}
