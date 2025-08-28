import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col bg-gray-50 text-black h-screen">
      <div className="flex p-10 m-10 justify-center items-center h-20 text-gray-900 text-5xl">
        Talk & Talk Auth Folder Layout
      </div>
      <div>{children}</div>
    </div>
  );
}
