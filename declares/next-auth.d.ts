import { Session as EnhancedSession, User } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  export interface Session extends EnhancedSession {
    user: User;
  }

  export interface User extends PrismaUser {}
}
