import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  Observable,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import axios from "axios";
import { secureGetItem, secureSetItem, secureRemoveItem } from "@/lib/utils";

// ──────────────────────────────
// 🔹 Base HTTP Link
// ──────────────────────────────
const httpLink = new HttpLink({
  uri: "http://localhost:8081/graphql",
  credentials: "include",
});

// ──────────────────────────────
// 🔹 Auth Link (adds JWT header)
// ──────────────────────────────
const authLink = setContext((_, { headers }) => {
  const token = secureGetItem("accessToken");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// ──────────────────────────────
// 🔹 Token Refresh Logic
// ──────────────────────────────
let isRefreshing = false;
let pendingRequests: Array<(token?: string | null) => void> = [];

const addPendingRequest = (callback: (token?: string | null) => void) => {
  pendingRequests.push(callback);
};

const resolvePendingRequests = (newToken?: string | null) => {
  pendingRequests.forEach((callback) => callback(newToken));
  pendingRequests = [];
};

/**
 * Requests a new access token from backend using refresh token.
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = secureGetItem("refreshToken");
    const user = secureGetItem("user");
    const email = user?.email;

    console.log(user)

    if (!refreshToken || !email) {
      console.warn("⚠️ No refresh token or email found");
      return null;
    }

    const response = await axios.post(
      "http://localhost:8081/api/auth/refresh-token",
      {
        refreshToken,
        email,
      }
    );

    const { accessToken, refreshToken: newRefresh } = response.data ?? {};

    if (accessToken) {
      secureSetItem("accessToken", accessToken);
      if (newRefresh) secureSetItem("refreshToken", newRefresh);
      console.log("✅ Token refreshed successfully");
      return accessToken;
    }

    console.warn("⚠️ No new access token in response");
    return null;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    return null;
  }
}

// ──────────────────────────────
// 🔹 Error Link (handles 401)
// ──────────────────────────────
const errorLink = new ErrorLink(({ result, error, operation, forward }) => {
  if (!result.errors?.length) return;

  for (const err of result.errors) {
    const code = err.extensions?.code;
    const message = err.message?.toLowerCase?.() ?? "";

    // Catch 401s
    if (code === "UNAUTHENTICATED" || message.includes("access denied")) {
      console.warn("🔒 Access denied — attempting token refresh...");

      return new Observable((observer) => {
        addPendingRequest((newToken) => {
          if (!newToken) {
            observer.error(new Error("Token refresh failed"));
            return;
          }

          // Retry failed operation with new token
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          }));

          const subscriber = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });

          return () => subscriber.unsubscribe();
        });

        if (!isRefreshing) {
          isRefreshing = true;
          (async () => {
            const newToken = await refreshAccessToken();
            resolvePendingRequests(newToken);

            if (!newToken) {
              // secureRemoveItem("accessToken");
              // secureRemoveItem("refreshToken");
              // secureRemoveItem("user");
              // Optionally redirect to login:
              // window.location.href = "/login";
            }

            isRefreshing = false;
          })();
        }
      });
    }
  }
});

// ──────────────────────────────
// 🔹 Apollo Client
// ──────────────────────────────
export const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});
