"use client";

import { UserProvider } from "@/hooks/use-user";
import { ReactNode } from "react";

export default function WrapperLayout({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
