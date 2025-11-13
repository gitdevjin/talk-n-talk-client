import { fetchWithRefreshClient } from "@/lib/client-api";
import { useState } from "react";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  username: string;
  status: string;
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  // --- Search users by username ---
  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);

    try {
      const data: SearchResult[] = await fetchWithRefreshClient(
        `${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/search?username=${search}`
      );

      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // --- Send friend request ---
  const handleAddFriend = async (userId: string) => {
    setLoading(true);

    try {
      await fetchWithRefreshClient(`${process.env.NEXT_PUBLIC_TNT_SERVER_URL}/users/friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId: userId }),
      });

      // update the result UI to reflect pending status
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "pending" } : u)));
    } catch (err) {
      console.error("Add friend failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[var(--color-darkgrey)] p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white">Add a Friend</h2>

        {/* Search input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username..."
            className="flex-1 border border-gray-600 bg-[var(--color-darkgrey-2)] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring "
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-3 py-2 text-lg rounded-lg hover:bg-blue-600 bg-blue-500 text-white disabled:opacity-50 hover:cursor-pointer"
          >
            {searching ? "..." : "🔎"}
          </button>
        </div>

        {/* Results */}
        <div className="max-h-52 overflow-y-auto no-scrollbar">
          {results.length > 0 ? (
            results.map((user) => {
              const status = user.status;

              return (
                <div
                  key={user.id}
                  className="flex justify-between items-center py-2 px-2 bg-[var(--color-darkgrey-2)] rounded-lg mb-2"
                >
                  <span className="text-gray-800 text-md">{user.username}</span>

                  {/* Button logic */}
                  {status === "none" || status === "declined" ? (
                    <button
                      onClick={() => handleAddFriend(user.id)}
                      disabled={loading}
                      className="px-3 py-1 rounded-md text-sm bg-blue-600 hover:bg-blue-500 hover:cursor-pointer text-gray-200 disabled:opacity-50"
                    >
                      {loading ? "..." : "Add"}
                    </button>
                  ) : status === "pending" ? (
                    <span className="text-gray-200 text-sm italic">Request Sent</span>
                  ) : status === "accepted" ? (
                    <span className="text-green-700 text-sm italic">Friends</span>
                  ) : status === "blocked" ? (
                    <span className="text-red-400 text-sm italic">Blocked</span>
                  ) : (
                    <div>Error</div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm text-center">
              {searching ? "Searching..." : "No users found"}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
