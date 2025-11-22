import { useState } from "react";
import { motion } from "framer-motion";

export default function CustomUpdateUserForm({
  user,
  meta,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    roleName: user.roleName || "",
    permissions: user.permissions || [],
    missingPermissions: user.missingPermissions || [],
  });

  const roleOptions = meta.roles || [];

  const updatePermission = (type, index, field, value) => {
    const updated = [...form[type]];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, [type]: updated });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-[750px] max-h-[90vh] overflow-auto space-y-8"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-2xl font-bold">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* USER BASIC DETAILS */}
        <div className="grid grid-cols-1 gap-4">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {/* ROLE DROPDOWN */}
          <select
            className="border rounded-lg px-3 py-2"
            value={form.roleName}
            onChange={(e) => setForm({ ...form, roleName: e.target.value })}
          >
            <option value="">Select Role</option>
            {roleOptions.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* PERMISSIONS */}
        <div className="space-y-6">
          {/* Assigned Permissions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Assigned Permissions</h3>

            <div className="space-y-2">
              {form.permissions.map((perm, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border p-3 rounded-lg"
                >
                  {/* Module Label */}
                  <div className="font-medium w-48">{perm.module}</div>

                  {/* Permission Checkboxes */}
                  <div className="flex gap-4">
                    {["canRead", "canAdd", "canUpdate", "canDelete", "canView"].map(
                      (field) => (
                        <label key={field} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={perm[field]}
                            onChange={(e) =>
                              updatePermission(
                                "permissions",
                                index,
                                field,
                                e.target.checked
                              )
                            }
                          />
                          <span className="text-sm">{field.replace("can", "")}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Permissions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Missing Permissions</h3>

            <div className="space-y-2">
              {form.missingPermissions.map((perm, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"
                >
                  {/* Module Label */}
                  <div className="font-medium w-48 text-gray-700">{perm.module}</div>

                  {/* Permission Checkboxes */}
                  <div className="flex gap-4">
                    {["canRead", "canAdd", "canUpdate", "canDelete", "canView"].map(
                      (field) => (
                        <label key={field} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={perm[field]}
                            onChange={(e) =>
                              updatePermission(
                                "missingPermissions",
                                index,
                                field,
                                e.target.checked
                              )
                            }
                          />
                          <span className="text-sm">{field.replace("can", "")}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 border rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
