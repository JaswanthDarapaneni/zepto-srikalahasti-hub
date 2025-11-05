import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const CustomerLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
  </>
);

export default CustomerLayout;
