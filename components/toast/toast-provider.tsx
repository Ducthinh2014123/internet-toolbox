"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";
type Toast = { id: number; message: string; variant: ToastVariant };

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const remove = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => remove(id), 3200);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "animate-toast-in pointer-events-auto flex items-start gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-lg",
            )}
          >
            {t.variant === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />}
            {t.variant === "error" && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
            {t.variant === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
            <span className="flex-1 text-card-foreground">{t.message}</span>
            <button
              aria-label="Dismiss"
              onClick={() => remove(t.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
