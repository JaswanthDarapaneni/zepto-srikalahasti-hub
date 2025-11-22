import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "@/common/apolloClient";
import UserComponent from "@/components/users/UserComponent";

import {
  GetUserByIdDocument,
  UserDto
} from "@/__generated__/graphql";

import { ArrowLeft } from "lucide-react";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const { data } = await client.query({
        query: GetUserByIdDocument,
        variables: { id: id },
        fetchPolicy: "no-cache",
      });

      setUser(data.getUserById);
    } catch (err) {
      console.error("Failed to load user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading user...</p>;
  }

  if (!user) {
    return <p className="p-6">User not found.</p>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/users")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} /> Back to Users
      </button>

      {/* UserComponent */}
      <UserComponent
        user={user}
        onUpdate={() => navigate(`/dashboard/users/${id}/edit`)}

        onRoleChange={(role) => console.log("Role changed:", role)}
        onPermissionUpdate={(p) => console.log("Updated perms:", p)}
        onStatusChange={(v) => console.log("Status changed:", v)}

        // Full permissions for now
        canEditUser={true}
        canEditRole={true}
        canDisableUser={true}
        canSeePermissions={true}
        canEditPermissions={true}
      />

    </div>
  );
}
