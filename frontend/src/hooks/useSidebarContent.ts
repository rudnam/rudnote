import { useEffect, useState, useCallback } from "react";
import type { Note } from "../types";

export function useSidebarContent(
  open: boolean,
  onClose: () => void,
  onEdit: (note: Note) => void
) {
  const [shouldRenderContent, setShouldRenderContent] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRenderContent(true);
    } else {
      const timeout = setTimeout(() => setShouldRenderContent(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const handleSelect = useCallback(
    (note: Note) => {
      onEdit(note);
      if (window.innerWidth < 768) onClose();
    },
    [onEdit, onClose]
  );

  return { shouldRenderContent, handleSelect };
}
