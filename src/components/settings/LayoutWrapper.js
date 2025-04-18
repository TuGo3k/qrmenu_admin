"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/auth");

  return (
    <div className="flex">
   
      {!hideSidebar && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
