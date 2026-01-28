import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, MessageCircle, Send } from "lucide-react";
import Button from "../../../components/common/Button";

export default function ChatbotDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [width, setWidth] = useState(420);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed right-0 top-0 bottom-0 w-full bg-white z-50 shadow-2xl border-l border-zinc-200"
          style={{ width: Math.max(320, Math.min(640, width)) }}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-transparent"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startW = width;
              const onMove = (ev: MouseEvent) => {
                const delta = startX - ev.clientX;
                setWidth(startW + delta);
              };
              const onUp = () => {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
              };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
          />
          <div className="h-full flex flex-col">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-2xl bg-black text-white flex items-center justify-center">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">
                      Data Health Assistant
                    </div>
                    <div className="text-xs text-zinc-600">
                      Ask about issues, rules, or syncs
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-2xl p-2 hover:bg-zinc-100"
                  aria-label="Close assistant"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-5 space-y-3">
                <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-3 text-sm text-zinc-700">
                  Hi! I can summarize issues, explain rules, and suggest next
                  steps.
                </div>
                <div className="rounded-2xl bg-white border border-zinc-200 p-3 text-sm text-zinc-700">
                  Try: “Why is planning blocked?” or “Show new issues since last
                  sync.”
                </div>
              </div>

              <div className="p-4 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question…"
                    className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none"
                  />
                  <Button
                    onClick={() => setInput("")}
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  No backend yet — this is a UI prototype.
                </div>
              </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
