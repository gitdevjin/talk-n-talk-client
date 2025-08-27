import { ReactNode } from "react";

// using static params replenish side menu

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      chat layout
      <div>sideMenu</div>
      {children}
    </div>
  );
}
