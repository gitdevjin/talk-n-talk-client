import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>layout header</div>
      {children}
    </div>
  );
}
