import React, { useState, useEffect } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm your Curtain Story Assistant. Ask me about fabrics, catalogues, or anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const whatsappNumber = "7417410714";

  // ✨ Delay the appearance for smooth fade-in
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Helper to send a message
  const addMessage = (msg) =>
    setMessages((prev) => [...prev, { from: "bot", text: msg }]);

  // ✅ Main message handler
  const handleSend = async () => {
    if (!input.trim()) return;
    const query = input.trim().toLowerCase();

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      // 🧠 1. FAQ-based response
      const faqResponse = handleFAQ(query);
      if (faqResponse) {
        addMessage(faqResponse);
        setLoading(false);
        return;
      }

      // 🧵 2. Supabase-powered responses
      if (query.includes("fabric") || query.includes("fabrics")) {
        await handleFabricQuery(query);
      } else if (query.includes("catalogue") || query.includes("catalog")) {
        await handleCatalogueQuery();
      } else if (query.includes("category") || query.includes("categories")) {
        await handleCategoryQuery();
      } else {
        addMessage(
          `🤔 I’m not sure about that — but you can chat directly with our team here 👉 <a href="https://wa.me/${whatsappNumber}" target="_blank" class="text-indigo-600 underline">Open WhatsApp</a>`
        );
      }
    } catch (err) {
      console.error(err);
      addMessage("⚠️ Sorry, something went wrong fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FAQ Quick Replies
  const handleFAQ = (query) => {
    const responses = [
      { key: "hello", text: "Hi there 👋 How can I assist you today?" },
      {
        key: "price",
        text: "Our prices depend on fabric type — you can browse them in our catalogue!",
      },
      {
        key: "consultation",
        text:
          "Yes! We offer free design consultations. Would you like me to connect you on WhatsApp?",
      },
      {
        key: "custom",
        text:
          "We specialize in *custom stitching* and *made-to-measure curtains*!",
      },
      {
        key: "measure",
        text:
          "You can find a full measurement guide on our website — or message us if you need help!",
      },
    ];

    const found = responses.find((r) => query.includes(r.key));
    return found ? found.text : null;
  };

  // ✅ Fetch fabrics dynamically
  const handleFabricQuery = async (query) => {
    let underPrice = query.match(/under\s?₹?(\d+)/i);
    const maxPrice = underPrice ? parseInt(underPrice[1]) : null;

    const { data, error } = await supabase
      .from("fabrics")
      .select("name, price_per_meter, category")
      .order("price_per_meter", { ascending: true })
      .limit(5);

    if (error || !data?.length) {
      addMessage("No fabrics found right now 😅 — please try again later.");
      return;
    }

    const filtered = maxPrice
      ? data.filter((f) => f.price_per_meter <= maxPrice)
      : data;

    let response =
      filtered.length === 0
        ? "No fabrics found under that criteria."
        : "🪡 Here are some fabrics you might like:<br>" +
          filtered
            .map(
              (f) =>
                `• <b>${f.name}</b> — ₹${f.price_per_meter}/m (${f.category})`
            )
            .join("<br>") +
          `<br><br>View full collection 👉 <a href="https://wa.me/${whatsappNumber}" target="_blank" class="text-indigo-600 underline">Chat on WhatsApp</a>`;

    addMessage(response);
  };

  // ✅ Fetch catalogues dynamically
  const handleCatalogueQuery = async () => {
    const { data, error } = await supabase
      .from("catalogues")
      .select("name, description")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      addMessage("No catalogues available at the moment.");
      return;
    }

    let response =
      "🗂️ Available Catalogues:<br>" +
      data
        .slice(0, 5)
        .map((c) => `• <b>${c.name}</b> — ${c.description || "No description"}`)
        .join("<br>") +
      `<br><br>Want to see them all? 👉 <a href="https://wa.me/${whatsappNumber}" target="_blank" class="text-indigo-600 underline">Chat on WhatsApp</a>`;

    addMessage(response);
  };

  // ✅ Fetch categories dynamically
  const handleCategoryQuery = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("name, description");

    if (error || !data?.length) {
      addMessage("No categories found currently.");
      return;
    }

    let response =
      "📂 Our available categories:<br>" +
      data
        .map((c) => `• <b>${c.name}</b> — ${c.description || "No description"}`)
        .join("<br>") +
      `<br><br>Would you like to browse? 👉 <a href="https://wa.me/${whatsappNumber}" target="_blank" class="text-indigo-600 underline">Open WhatsApp</a>`;

    addMessage(response);
  };

  // ✅ Enter key handler
  const handleKeyDown = (e) => e.key === "Enter" && handleSend();

  return (
    <>
      {/* 💬 Floating Chat Button (Bottom Left) */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-8 left-6 bg-indigo-600 text-white rounded-full p-4 shadow-xl hover:bg-indigo-700 transition-all z-50 animate-pulse-glow ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        title="Chat with Curtain Story Assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      {/* 💭 Chat Window */}
      {open && (
        <div className="fixed bottom-24 left-6 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 animate-fade-in">
          <div className="bg-indigo-600 text-white p-3 font-semibold text-center">
            Curtain Story Assistant
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-96">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm ${
                  msg.from === "bot"
                    ? "bg-gray-100 text-gray-800 self-start"
                    : "bg-indigo-600 text-white self-end"
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.text,
                }}
              ></div>
            ))}
            {loading && (
              <div className="text-gray-400 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
              </div>
            )}
          </div>

          <div className="p-3 border-t flex items-center gap-2 bg-gray-50">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ✨ Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 rgba(99,102,241,0); transform: scale(1); }
          50% { box-shadow: 0 0 20px rgba(99,102,241,0.4); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 rgba(99,102,241,0); transform: scale(1); }
        }
        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ChatBot;
