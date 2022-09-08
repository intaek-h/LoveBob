import { Session as EnhancedSession } from "next-auth";

declare module "next-auth" {
  export interface Session extends EnhancedSession {
    userId: string;
  }
}
