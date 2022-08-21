// @ts-nocheck
import { useQuery, QueryObserverOptions } from "react-query";
import { useRouter } from "next/router";
import { Session } from "next-auth";

interface SessionOptions {
  required?: boolean;
  redirectTo?: string;
  queryConfig: QueryObserverOptions;
}

type Response = [Session, boolean];

export const SESSION_STALE_TIME = 60 * 1000 * 60 * 3; // 3 hours
export const SESSION_REFETCH_INTERVAL = 60 * 1000 * 3; // 3 minutes

export async function fetchSession() {
  const res = await fetch("/api/auth/session");
  const session = await res.json();
  if (Object.keys(session).length) {
    return session;
  }
  return null;
}

export function useSession({
  required,
  redirectTo = "/api/auth/signin?error=SessionExpired",
  queryConfig = {},
}: SessionOptions = {}): Response {
  const router = useRouter();
  const query = useQuery(["session"], fetchSession, {
    ...queryConfig,
    staleTime: SESSION_STALE_TIME,
    refetchInterval: SESSION_REFETCH_INTERVAL,
    onSettled(data, error) {
      if (queryConfig.onSettled) queryConfig.onSettled(data, error);
      if (data || !required) return;
      router.push(redirectTo);
    },
  });
  return [query.data, query.status === "loading"];
}
