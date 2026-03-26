import { Button } from "../ui/button";
import {
  ArrowUp,
  Bot,
  ChevronDown,
  ClipboardList,
  ListChecks,
  MessageCircle,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "../ui/scroll-area";

// ── Types ──────────────────────────────────────────────────────────────────

interface MessageType {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mb-3 flex justify-end px-2"
    >
      <div className="max-w-[78%] rounded-3xl rounded-br-lg bg-indigo-600/90 px-4 py-2.5 text-sm text-white shadow-2xl shadow-indigo-500/20 backdrop-blur">
        {text}
      </div>
    </motion.div>
  );
}

function AIBubble({ text, isError }: { text: string; isError?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mb-3 flex items-start gap-2 px-2"
    >
      {/* AI icon */}
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-sm shadow-slate-400/10">
        <Bot className="h-3.5 w-3.5 text-indigo-600" />
      </div>

      <div
        className={`max-w-[82%] rounded-3xl rounded-tl-lg px-4 py-2.5 text-sm leading-relaxed backdrop-blur
          ${isError
            ? "bg-red-50/60 border border-red-200/50 text-red-700 shadow-lg shadow-red-500/10"
            : "bg-white/55 border border-white/40 text-slate-700 shadow-2xl shadow-slate-500/10"
          }`}
      >
        <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-p:my-1 prose-strong:text-slate-900 prose-pre:bg-slate-100/60 prose-pre:border prose-pre:border-white/50 prose-pre:rounded-2xl prose-pre:p-3">
          <ReactMarkdown
            components={{
              h1: (p) => <h1 {...p} className="m-0 mb-2 text-sm font-semibold text-slate-900" />,
              h2: (p) => <h2 {...p} className="m-0 mb-2 text-sm font-semibold text-slate-900" />,
              h3: (p) => <h3 {...p} className="m-0 mb-2 text-sm font-semibold text-slate-900" />,
              ul: (p) => <ul {...p} className="my-2 space-y-2 pl-0" />,
              ol: (p) => <ol {...p} className="my-2 space-y-2 pl-0" />,
              li: (p) => <li {...p} className="list-none" />,
              a: (p) => <a {...p} className="text-indigo-700 underline underline-offset-2" />,
              blockquote: (p) => (
                <blockquote
                  {...p}
                  className="my-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-slate-700 shadow-lg shadow-slate-500/10"
                />
              ),
              table: (p) => (
                <div className="my-2 overflow-hidden rounded-2xl border border-white/40 bg-white/40 shadow-lg shadow-slate-500/10">
                  <table {...p} className="w-full text-left" />
                </div>
              ),
              thead: (p) => <thead {...p} className="bg-white/50" />,
              th: (p) => <th {...p} className="px-3 py-2 text-[11px] font-semibold text-slate-900" />,
              td: (p) => <td {...p} className="px-3 py-2 text-[11px] text-slate-700" />,
              code: ({ className, children, ...props }) => {
                const isBlock = Boolean(className);
                if (isBlock) return <code className={className} {...props}>{children}</code>;
                return (
                  <code
                    {...props}
                    className="rounded-md border border-white/50 bg-white/60 px-1 py-0.5 text-[12px] text-slate-800"
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </ReactMarkdown>
        </div>

        {/* Quick replies: parse markdown-style [label](quick:payload) links into glass pills */}
        {(() => {
          const quickLinks = Array.from(text.matchAll(/\[([^\]]+)\]\(quick:([^\)]+)\)/g)).map((m) => ({
            label: m[1],
            payload: m[2],
          }));

          if (quickLinks.length === 0) return null;

          return (
            <div className="mt-3 flex flex-wrap gap-2">
              {quickLinks.map((q, i) => (
                <button
                  key={`${q.payload}-${i}`}
                  onClick={() => {
                    // quick reply should act like user selecting a suggestion
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    (async () => {})();
                  }}
                  className="rounded-full border border-white/40 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-lg shadow-slate-500/10 backdrop-blur transition-all hover:bg-white/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-500/15"
                >
                  {q.label}
                </button>
              ))}
            </div>
          );
        })()}
      </div>
    </motion.div>
  );
}

function WelcomeScreen({ onSelect }: { onSelect: (text: string) => void }) {
  const options = [
    {
      icon: <ListChecks className="h-4 w-4 text-indigo-600" />,
      label: "Xem danh sách thiết bị",
      sub: "Tìm thiết bị đang sẵn sàng",
      bg: "bg-indigo-500/10",
    },
    {
      icon: <ClipboardList className="h-4 w-4 text-violet-600" />,
      label: "Lịch sử mượn trả của tôi",
      sub: "Các đơn mượn hiện tại",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-5 py-8 px-2 text-center">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/20"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-1"
      >
        <h2 className="text-base font-semibold text-slate-900">FEMS AI Assistant</h2>
        <p className="text-xs text-slate-500 leading-relaxed px-4">
          Hỏi tôi về thiết bị, mượn trả, hoặc tình trạng phòng học.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="w-full space-y-2"
      >
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt.label)}
            className="group flex w-full items-center gap-3 rounded-2xl border border-white/40 bg-white/50 px-4 py-3 text-left backdrop-blur transition-all hover:bg-white/65 hover:shadow-lg hover:shadow-slate-500/15 hover:-translate-y-0.5"
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${opt.bg} border border-white/40 backdrop-blur-sm`}>
              {opt.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800">{opt.label}</p>
              <p className="text-xs text-slate-400">{opt.sub}</p>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="mb-3 flex items-start gap-2 px-2">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-sm shadow-slate-400/10">
        <Bot className="h-3.5 w-3.5 text-indigo-600" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/50 bg-white/60 backdrop-blur px-4 py-3 shadow-lg shadow-slate-500/10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageContainer, setMessageContainer] = useState<MessageType[]>([]);
  const user = useAuthStore((s) => s.user);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messageContainer, isTyping, isOpen]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || message;
    if (!textToSend.trim() || isTyping) return;

    const userMessageContent = textToSend.trim();
    setMessage("");
    setMessageContainer((prev) => [...prev, { role: "user", content: userMessageContent }]);
    setIsTyping(true);

    const history = messageContainer.slice(-4);

    try {
      const res = await api.post("/ai/chat", {
        user_id: user?._id,
        message: userMessageContent,
        history,
      });
      const aiResponse = res.data.response || "Tôi không nhận được phản hồi từ máy chủ.";
      setMessageContainer((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch {
      setMessageContainer((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ **Lỗi kết nối** đến máy chủ AI. Vui lòng thử lại sau.", isError: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = async () => {
    if (messageContainer.length > 0) {
      try { await api.post("/ai/reset", { user_id: user?._id }); } catch { /* silent */ }
    }
    setMessageContainer([]);
    setIsTyping(false);
  };

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        /* ── FAB ── */
        <motion.div
          key="fab"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </motion.div>
      ) : (
        /* ── Chat Window ── */
        <motion.div
          key="chat-window"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 flex h-150 w-95 flex-col overflow-hidden rounded-3xl border border-white/30 bg-white/70 shadow-2xl shadow-slate-500/25 backdrop-blur-xl"
        >
          {/* ── Header ── */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/30 bg-white/55 backdrop-blur px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-none">FEMS AI Assistant</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-slate-500">ready</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewChat}
                title="Làm mới chat"
                className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white/60"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white/60"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="relative flex-1 overflow-hidden">
            <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-6 bg-linear-to-b from-white/60 to-transparent" />

            <ScrollArea className="h-full py-4">
              {messageContainer.length === 0 ? (
                <WelcomeScreen onSelect={(t) => handleSend(t)} />
              ) : (
                <>
                  {messageContainer.map((item, idx) =>
                    item.role === "user" ? (
                      <UserBubble key={idx} text={item.content} />
                    ) : (
                      <AIBubble key={idx} text={item.content} isError={item.isError} />
                    )
                  )}
                  {isTyping && <TypingIndicator />}
                  <div className="h-2" />
                </>
              )}
              <div ref={endOfMessagesRef} className="h-1" />
            </ScrollArea>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-6 bg-linear-to-t from-white/60 to-transparent" />
          </div>

          {/* ── Input ── */}
          <div className="shrink-0 border-t border-white/30 bg-white/55 backdrop-blur px-3 py-3">
            <div className="flex items-center gap-2 rounded-full bg-slate-50/70 px-3 py-2 shadow-2xl shadow-slate-500/10 backdrop-blur transition-all focus-within:ring-2 focus-within:ring-indigo-200/60">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                autoFocus
                placeholder="Hỏi về thiết bị, phòng học..."
                className="flex-1 bg-transparent px-1 py-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
              <button
                disabled={!message.trim() || isTyping}
                onClick={() => handleSend()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-500">
              FEMS AI · Powered assistant
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatBox;
