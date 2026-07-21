"use client";

import { useCallback } from "react";
import { toast } from "sonner";

/** Copies text to the clipboard, falling back to execCommand in insecure/older contexts. */
async function copy(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }
  document.body.removeChild(textArea);
  return succeeded;
}

export function useClipboard() {
  return useCallback((text: string, successMessage = "Copied to clipboard") => {
    if (!text) return;
    copy(text).then((succeeded) => {
      if (succeeded) {
        toast.success(successMessage);
      } else {
        toast.error("Couldn't copy to clipboard");
      }
    });
  }, []);
}
