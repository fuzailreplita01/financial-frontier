import type { User, InsertUser, Payment, InsertPayment } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  deactivateUser(id: number): Promise<void>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  listPayments(): Promise<Payment[]>;
  listUserPayments(userId: number): Promise<Payment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private payments: Map<number, Payment>;
  private currentUserId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentPaymentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId,
    );
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      firebaseId: insertUser.firebaseId,
      email: insertUser.email,
      role: insertUser.role,
      name: insertUser.name,
      active: insertUser.active,
    };
    this.users.set(id, user);
    return user;
  }

  async deactivateUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    if (user) {
      this.users.set(id, { ...user, active: false });
    }
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      id,
      userId: insertPayment.userId,
      amount: insertPayment.amount,
      month: insertPayment.month,
      year: insertPayment.year,
      collectedBy: insertPayment.collectedBy,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async listPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values()).sort((a, b) => {
      const aTime = a.createdAt?.getTime() ?? 0;
      const bTime = b.createdAt?.getTime() ?? 0;
      return bTime - aTime;
    });
  }

  async listUserPayments(userId: number): Promise<Payment[]> {
    return (await this.listPayments()).filter((p) => p.userId === userId);
  }
}

export const storage = new MemStorage();