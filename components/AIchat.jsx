"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "👋 Hi! I am **FinFold AI Advisor 💰**\n\nI can help you with:\n- 📊 Net Worth Analysis\n- 💸 SIP / SWP Planning\n- 🎯 Goal-based Investing\n- ⚠️ Risk Analysis\n\nAsk me anything!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: userMessage,
          context:
            "You are a financial advisor inside FinFold app. Give practical investment advice in simple terms.",
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-[9999] group">
          <div className="absolute bottom-16 right-0 text-xs bg-[#1a1230] text-blue-200 border border-blue-500 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
            Financial Advisor 💰
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-500 p-4 rounded-full text-white shadow-lg hover:scale-105 transition"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[380px] h-[550px] rounded-2xl shadow-xl flex flex-col bg-[#0f172a] text-white">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <div>
                <h2 className="font-semibold text-sm">FinFold AI Advisor 💰</h2>
                <p className="text-xs text-blue-400">● Smart Finance Bot</p>
              </div>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.role === "bot" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {loading && <p className="text-gray-400 text-sm">Thinking...</p>}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              className="flex-1 bg-gray-800 p-2 rounded-lg outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, SIP, goals..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-500 px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
