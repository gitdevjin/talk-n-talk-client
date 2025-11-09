import { ReactNode } from "react";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex justify-center items-center py-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">Talk & Talk</h1>
      </header>

      {/* Children container */}
      <main className="flex flex-col flex-grow items-center justify-start pt-6 px-4">
        {children}
      </main>
    </div>
  );
}
