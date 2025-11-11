"use client";

type Props = { onlineUsers: string[] };

export const OnlineUsers = ({ onlineUsers }: Props) => (
  <div className="bg-white shadow-md rounded-xl p-4 h-full flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Online Users</h2>
    <ul className="flex-1 overflow-y-auto divide-y divide-gray-200 rounded scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {onlineUsers.length ? (
        onlineUsers.map((user) => (
          <li
            key={user}
            className="py-2 px-3 hover:bg-blue-50 rounded transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            {user}
          </li>
        ))
      ) : (
        <li className="text-gray-400 py-2 px-3">No users online</li>
      )}
    </ul>
  </div>
);
