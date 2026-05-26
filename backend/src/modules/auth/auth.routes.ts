import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { signToken } from "../../common/auth.js";
import { db } from "../../firebase/admin.js";
import type { UserDocument } from "../../firebase/types.js";
import { withId } from "../../firebase/types.js";

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
    return res.status(400).json({ message: "Dados invalidos.", issues: body.error.issues });
  }

  const emailLower = body.data.email.toLowerCase();
  const existingUser = await db
    .collection("users")
    .where("emailLower", "==", emailLower)
    .limit(1)
    .get();

  if (!existingUser.empty) {
    return res.status(409).json({ message: "E-mail ja cadastrado." });
  }

  const passwordHash = await bcrypt.hash(body.data.password, 10);
  const now = new Date().toISOString();
  const userRef = db.collection("users").doc();
  const user: UserDocument = {
    name: body.data.name,
    email: body.data.email,
    emailLower,
    passwordHash,
    plan: "FREE",
    createdAt: now,
    updatedAt: now
  };

  await userRef.set(user);

  return res.status(201).json({
    token: signToken({ id: userRef.id, plan: user.plan }),
    user: sanitizeUser(withId(userRef.id, user))
  });
});

authRouter.post("/login", async (req, res) => {
  const body = credentialsSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ message: "Dados invalidos.", issues: body.error.issues });
  }

  const usersSnapshot = await db
    .collection("users")
    .where("emailLower", "==", body.data.email.toLowerCase())
    .limit(1)
    .get();
  const userDoc = usersSnapshot.docs[0];
  const user = userDoc?.data() as UserDocument | undefined;
  const passwordMatches = user ? await bcrypt.compare(body.data.password, user.passwordHash) : false;

  if (!user || !passwordMatches) {
    return res.status(401).json({ message: "Credenciais invalidas." });
  }

  return res.json({
    token: signToken({ id: userDoc.id, plan: user.plan }),
    user: sanitizeUser(withId(userDoc.id, user))
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
