import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { adminAuth } from "./firebase";
import { insertUserSchema, insertPaymentSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/auth/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    try {
      const token = await adminAuth.verifyIdToken(authHeader.split(" ")[1]);
      const user = await storage.getUserByFirebaseId(token.uid);

      if (!user) {
        const newUser = await storage.createUser({
          firebaseId: token.uid,
          email: token.email!,
          name: token.name || token.email!,
          role: "user",
          active: true,
        });
        return res.json(newUser);
      }

      res.json(user);
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  app.get("/api/users", async (req, res) => {
    const users = await storage.listUsers();
    res.json(users);
  });

  app.patch("/api/users/:id/deactivate", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deactivateUser(id);
    res.json({ success: true });
  });

  app.get("/api/payments", async (req, res) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const payments = userId
      ? await storage.listUserPayments(userId)
      : await storage.listPayments();
    res.json(payments);
  });

  app.post("/api/payments", async (req, res) => {
    const parsed = insertPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const payment = await storage.createPayment(parsed.data);
    res.json(payment);
  });

  return createServer(app);
}