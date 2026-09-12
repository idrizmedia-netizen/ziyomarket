"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { subscribeSellerChat, sendSellerMessage } from "../lib/firestore";

export default function SellerChatThread({ sellerEmail, currentUserEmail, currentUserName, asAdmin }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!sellerEmail) return;
    const unsub = subscribeSellerChat(sellerEmail, setMessages);
    return () => unsub();
  }, [sellerEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendSellerMessage(sellerEmail, {
        senderEmail: currentUserEmail,
        senderName: currentUserName,
        text: text.trim(),
        fromAdmin: asAdmin,
      });
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 p-3.5 bg-bg rounded-xl mb-3 min-h-[240px] max-h-[360px]">
        {messages.length === 0 ? (
          <div className="text-sm text-muted text-center my-auto">
            Hali xabar yo&apos;q. Taklif yoki savolingizni yozing.
          </div>
        ) : (
          messages.map((m) => {
            const isMine = m.senderEmail === currentUserEmail;
            return (
              <div
                key={m.id}
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  isMine
                    ? "bg-primary text-white self-end rounded-br-sm"
                    : "bg-white border border-border self-start rounded-bl-sm"
                }`}
              >
                {!isMine && (
                  <div className="text-[10px] font-bold opacity-70 mb-0.5">
                    {m.fromAdmin ? "Admin" : m.senderName}
                  </div>
                )}
                {m.text}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Xabar yozing..."
          className="flex-1 border border-border rounded-full px-4 py-2.5 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="w-11 h-11 shrink-0 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
