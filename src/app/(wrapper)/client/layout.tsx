import Sidebar from "@/components/Sidebar";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>chat layout</div>
      <Sidebar />
      {children}
    </div>
  );
}
