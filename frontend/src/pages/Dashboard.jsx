// Dashboard page displaying real-time updates using WebSocket.
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (data) => {
      setMessage(data);
    });

    return () => socket.off("notification");
  }, [socket]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>

      <div className="mt-6 p-4 bg-blue-100 rounded">
        <p className="font-semibold">Real-time Updates:</p>

        {message ? (
          <p className="text-blue-800 mt-2">{message}</p>
        ) : (
          <p className="text-gray-500">Waiting for updates...</p>
        )}
      </div>
    </div>
  );
}
