import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white antialiased">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Welcome to Talk n Talk
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          Connect with your friends and start chatting instantly.
        </p>

        <Link href="/client/dm/friend">
          <div className="inline-block bg-blue-600 hover:bg-blue-500 transition-all duration-200 px-6 py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-blue-500/30 active:scale-95 select-none cursor-pointer">
            Get Started →
          </div>
        </Link>
      </div>
    </div>
  );
}
