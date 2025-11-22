import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";


type Role = 
  | "admin"
  | "manager"
  | "shop_owner"
  | "delivery_agent"
  | "support"
  | "customer";

interface http {
  url: String;
  method: String;
}
interface CRUD {
  GetById: http;
  GetAll: http;
  Update: http;
  Delete: http;
}
interface APIs {
  users: CRUD;
}
const Summary: Record<Role, APIs> = {
  admin: {
    users: {
      GetById: { url: "", method: "" },
      GetAll: { url: "users", method: "get" },
      Update: { url: "", method: "" },
      Delete: { url: "", method: "" },
    },
  },
  manager: undefined,
  shop_owner: undefined,
  delivery_agent: undefined,
  support: undefined,
  customer: undefined,
};

export const baseURL = "http://localhost:8081/api/";

export const AuthSummary = {
  login: {
    url: "/auth/login",
    method: "post",
  },
  register: {
    url: "/auth/register/",
    method: "post",
  },
  refresh: {
    url: "/auth/refresh-token",
    method: "post",
  },

};

export const getAPI = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) {
    toast({
      title: "Un-Authorized",
      description: "You dont have access to use routes",
    });
    navigate('/login')
    return null;
  }
  const role = user?.name as Role;
  return {
    ...Summary[role],
  };
};
