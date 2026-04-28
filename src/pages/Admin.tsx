import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "./admin/AdminLayout";

export default function Admin() {
  return (
    <ProtectedRoute requiredRole={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  );
}
