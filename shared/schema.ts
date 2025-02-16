import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseId: text("firebase_id").notNull().unique(),
  email: text("email").notNull(),
  role: text("role", { enum: ["admin", "accountant", "user"] }).notNull().default("user"),
  name: text("name").notNull(),
  active: boolean("active").notNull().default(true),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: integer("amount").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  collectedBy: integer("collected_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export const userRoles = ["admin", "accountant", "user"] as const;
export type UserRole = (typeof userRoles)[number];
