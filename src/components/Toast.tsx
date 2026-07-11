"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { X, Sparkles, Zap, Trophy, Check } from "lucide-react";

interface Toast {
  id: string;
  type: "xp" | "badge" | "levelup" | "success" | "error";
  message: string;
  amount?: number;
  badgeName?: string;
  level?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export const useToast = () => useContext(ToastContext);

// Global reference for external use
let globalAddToast: ((toast: Omit<Toast, "id">) => void) | null = null;

// Helper function that can be called from anywhere (no hook needed)
export function addGlobalToast(toast: Omit<Toast, "id">) {
  if (globalAddToast) {
    globalAddToast(toast);
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Register global reference
  useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border shadow-xl p-4 min-w-[300px] max-w-[380px] animate-slide-in-right transition-all ${
              toast.type === "xp"
                ? "bg-[#545863] border-[#f9c846]/30"
                : toast.type === "badge"
                ? "bg-gradient-to-r from-[#f9c846]/20 to-[#f96e46]/20 border-[#f9c846]/40"
                : toast.type === "success"
                ? "bg-[#97cc04]/10 border-[#97cc04]/30"
                : toast.type === "error"
                ? "bg-[#f96e46]/10 border-[#f96e46]/30"
                : "bg-gradient-to-r from-[#c084fc]/30 to-[#f9c846]/30 border-[#c084fc]/50"
            }`}
          >
            {/* Icon */}
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              toast.type === "xp"
                ? "bg-[#f9c846]/20"
                : toast.type === "badge"
                ? "bg-[#f9c846]/30"
                : toast.type === "success"
                ? "bg-[#97cc04]/20"
                : toast.type === "error"
                ? "bg-[#f96e46]/20"
                : "bg-[#c084fc]/30"
            }`}>
              {toast.type === "xp" ? (
                <Zap size={20} className="text-[#f9c846]" />
              ) : toast.type === "badge" ? (
                <Trophy size={20} className="text-[#f9c846]" />
              ) : toast.type === "success" ? (
                <Check size={20} className="text-[#97cc04]" />
              ) : toast.type === "error" ? (
                <X size={20} className="text-[#f96e46]" />
              ) : (
                <Sparkles size={20} className="text-[#c084fc]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${
                toast.type === "xp" ? "text-white" : "text-[#545863]"
              }`}>
                {toast.message}
              </p>
              {toast.amount && (
                <p className={`text-xs mt-0.5 ${
                  toast.type === "xp" ? "text-[#f9c846]" : "text-[#7b7f89]"
                }`}>
                  {toast.type === "xp" ? `+${toast.amount} XP` : `+${toast.amount} XP bonus`}
                </p>
              )}
              {toast.level && (
                <p className="text-xs text-[#c084fc] mt-0.5">New Level: {toast.level}</p>
              )}
            </div>

            {/* Close */}
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={14} className="text-[#7b7f89]" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}