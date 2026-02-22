"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";
import { trackCopyEvent } from "@/lib/analytics";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  analyticsId?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  className = "",
  analyticsId,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (!success) return;
    if (analyticsId) {
      void trackCopyEvent(analyticsId);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded border border-dark-border bg-dark-card px-3 py-2 text-xs font-semibold text-dark-text transition hover:border-accent-green hover:text-accent-green ${className}`}
      aria-label={label}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
