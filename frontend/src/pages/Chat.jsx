import React, { useState } from "react";
import { askAI } from "../services/aiService";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent empty submit

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await askAI(userMessage.content);

      const botMessage = {
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❗ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        AI Study Assistant
      </h1>

      {/* Chat Window */}
      <div className="border rounded-lg p-4 h-[65vh] overflow-y-auto bg-white dark:bg-gray-800 shadow">
        {messages.length === 0 && !loading && (
          <div className="text-gray-400 text-center mt-10">
            Start the conversation by asking a question...
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 my-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-200 dark:bg-blue-600 ml-auto text-right"
                : "bg-gray-200 dark:bg-gray-700 mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 italic">AI is thinking...</div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex mt-4">
        <textarea
          className="flex-1 border rounded-l px-3 py-2 h-14 resize-none focus:outline-none dark:bg-gray-800"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
