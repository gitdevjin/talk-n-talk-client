"use client";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const { register } = useUser();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(username, email, password); // register handles API + token
      router.push("/client/dm/friend"); // redirect after signup
    } catch (err) {
      setError(`Registration Failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            required
          />

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition hover:cursor-pointer"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <div className="flex justify-center text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-blue-500 hover:underline ml-1 hover:cursor-pointer"
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
