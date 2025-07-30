import { useEffect, useRef } from "react";

export function useAutoSave({
  content,
  isSaving,
  hasUnsavedChanges,
  onAutoSave,
}: {
  content: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onAutoSave: () => void;
}) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!content.trim() || isSaving || !hasUnsavedChanges) return;

    timeoutRef.current = window.setTimeout(onAutoSave, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, isSaving, hasUnsavedChanges, onAutoSave]);
}
