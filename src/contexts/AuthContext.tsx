import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Axios from "@/common/Axios";
import { AuthSummary } from "@/common/SummaryApi";
import { jwtDecode } from "jwt-decode";
import { secureGetItem, secureSetItem, secureRemoveItem } from "@/lib/utils";
import { client } from "@/common/apolloClient";
import { GetUserByEmailDocument } from "@/__generated__/graphql";

// interface Role {
//   id: any;
//   name: string;
// }
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // const saved = localStorage.getItem("user");
    return secureGetItem("user") || null;
  });

  useEffect(() => {
    if (user) {
      secureSetItem("user", user);
    } else {
      secureRemoveItem("user");
      // localStorage.removeItem("user");
    }
  }, [user]);

  const refreshAccessToken = async (): Promise<string | null> => {
    const oldRefreshToken = secureGetItem("refreshToken");
    const userData = secureGetItem("user");

    if (!oldRefreshToken || !userData?.email) return null;

    try {
      const res = await Axios({
        ...AuthSummary.refresh,
        data: { refreshToken: oldRefreshToken, email: userData.email },
      });
      const { accessToken, refreshToken } = res.data;
      secureSetItem("accessToken", accessToken);
      secureSetItem("refreshToken", refreshToken);
      return accessToken;
    } catch (err) {
      console.error("Token refresh failed", err);
      logout();
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await Axios({
        ...AuthSummary.login,
        data: { email, password },
      });
      const { accessToken, refreshToken } = response.data;
      secureSetItem("accessToken", accessToken);
      secureSetItem("refreshToken", refreshToken);

      try {
        const { data } = await client.query({
          query: GetUserByEmailDocument,
          variables: { email },
        });

        secureSetItem("permission", data.getUserByEmail.permissions);
      } catch (error) {
        console.log("error", error);
      }

      // ✅ Properly extract token and user
      // console.log(response)
     
      if (accessToken) {
        const decoded: User = jwtDecode(accessToken);
        const u: User = {
          id: decoded.id,
          createdAt: decoded.createdAt,
          email: decoded.email,
          name: decoded.name,
          phone: decoded.phone,
          role: decoded.role,
        };
        setUser(u);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
  setUser(null);
  secureRemoveItem('accessToken');
  secureRemoveItem('refreshToken');
  secureRemoveItem('permission')
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
