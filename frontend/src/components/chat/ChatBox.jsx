import { Button } from "../ui/button";
import {
  ArrowUp,
  Bot,
  Calendar,
  ChevronDown,
  ClipboardList,
  Clock,
  ListChecks,
  MessageCircle,
  RefreshCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "../ui/scroll-area";

// ── Sub-components ─────────────────────────────────────────────────────────

function UserBubble({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mb-3 flex justify-end px-3"
    >
      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-2.5 text-sm text-white shadow-sm">
        {text}
      </div>
    </motion.div>
  );
}

function AIBubble({ text, isError }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mb-3 flex items-start gap-2 px-3"
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100">
        <Bot className="h-3.5 w-3.5 text-indigo-600" />
      </div>
      <div
        className={`max-w-[82%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed
          ${isError
            ? "bg-red-50 border border-red-200 text-red-700"
            : "bg-white border border-slate-200 text-slate-700 shadow-sm"
          }`}
      >
        <div className="prose prose-sm prose-slate prose-p:leading-relaxed prose-p:my-1 prose-pre:bg-slate-100 prose-pre:p-2 prose-ol:list-decimal prose-ul:list-disc max-w-none">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}

function WelcomeScreen({ onSelect }) {
  const options = [
    {
      icon: <ListChecks className="h-4 w-4 text-indigo-500" />,
      label: "Thiết bị tôi có thể mượn",
      sub: "Xem thiết bị sẵn sàng trong ca học",
      bg: "bg-indigo-50",
    },
    {
      icon: <Calendar className="h-4 w-4 text-violet-500" />,
      label: "Lịch học hôm nay của tôi",
      sub: "Ca học, phòng và trạng thái điểm danh",
      bg: "bg-violet-50",
    },
    {
      icon: <ClipboardList className="h-4 w-4 text-sky-500" />,
      label: "Đơn mượn của tôi",
      sub: "Xem trạng thái các đơn mượn",
      bg: "bg-sky-50",
    },
    {
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      label: "Bao giờ tôi mượn được thiết bị?",
      sub: "Ca học tiếp theo có thể mượn",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-3 text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-13 w-13 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-1"
      >
        <h2 className="text-base font-semibold text-slate-800">FEMS AI Assistant</h2>
        <p className="text-xs text-slate-500 leading-relaxed px-2">
          Hỏi tôi về thiết bị, lịch học hoặc đơn mượn của bạn.
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
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/50 active:scale-[0.98]"
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${opt.bg}`}>
              {opt.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">{opt.label}</p>
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
    <div className="mb-3 flex items-start gap-2 px-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100">
        <Bot className="h-3.5 w-3.5 text-indigo-600" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
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
  const [isOpen, setIsOpenLocal] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageContainer, setMessageContainer] = useState([]);
  const user = useAuthStore((s) => s.user);
  const setIsChatOpen = useChatStore((s) => s.setIsChatOpen);

  const setIsOpen = (val) => {
    setIsOpenLocal(val);
    setIsChatOpen(val);
  };
  const inputRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messageContainer, isTyping, isOpen]);

  // Focus input khi mở chat trên mobile
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (overrideText) => {
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

  const handleNewChat = () => {
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
          className="fixed bottom-5 right-5 z-50"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-300/50 transition-transform hover:scale-105 active:scale-95 hover:bg-indigo-700"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </motion.div>
      ) : (
        /* ── Chat Window ── */
        <motion.div
          key="chat-window"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={[
            // base
            "fixed z-50 flex flex-col overflow-hidden",
            "border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-300/50",
            // mobile: full screen, no border-radius on bottom
            "inset-x-0 bottom-0 top-0 rounded-none",
            // tablet+: bottom sheet, rounded corners
            "sm:inset-x-auto sm:top-auto sm:bottom-5 sm:right-5",
            "sm:h-[600px] sm:w-[390px] sm:rounded-2xl",
          ].join(" ")}
        >
          {/* ── Header ── */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 safe-area-top">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-none">FEMS AI</p>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewChat}
                title="Làm mới chat"
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
              </Button>
              {/* Desktop: thu nhỏ xuống FAB */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hidden sm:flex h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              {/* Mobile: đóng hẳn */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="flex sm:hidden h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="relative flex-1 overflow-hidden">
            <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-5 bg-gradient-to-b from-slate-50 to-transparent" />

            <ScrollArea className="h-full py-3">
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

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-5 bg-gradient-to-t from-slate-50 to-transparent" />
          </div>

          {/* ── Input ── */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 safe-area-bottom">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Hỏi về thiết bị, lịch học..."
                className="flex-1 bg-transparent py-1.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
              <button
                disabled={!message.trim() || isTyping}
                onClick={() => handleSend()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-400">
              FEMS AI · Hỏi về thiết bị · Mượn nhanh
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatBox;
