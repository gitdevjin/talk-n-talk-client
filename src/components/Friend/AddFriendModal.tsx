import { useState } from "react";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{ id: string; username: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  if (!isOpen) return null;

  // --- Search users by username ---
  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);

    try {
      // example API endpoint — change as needed
      const res = await fetch(`/api/users/search?username=${search}`);
      const data = await res.json();
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
      await fetch(`/api/friends/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setSentRequests((prev) => [...prev, userId]);
    } catch (err) {
      console.error(err);
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
            results.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center py-2 px-2 bg-[var(--color-darkgrey-3)] rounded-lg mb-2"
              >
                <span className="text-white text-sm">{user.username}</span>

                {sentRequests.includes(user.id) ? (
                  <span className="text-gray-400 text-xs italic">Request Sent</span>
                ) : (
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    disabled={loading}
                    className="px-3 py-1 rounded-md text-sm bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                  >
                    {loading ? "..." : "Add"}
                  </button>
                )}
              </div>
            ))
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
