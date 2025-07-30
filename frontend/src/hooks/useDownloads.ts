import type { Note } from "../types";

export function useDownloads() {
  const downloadNote = (note: Note) => {
    const blob = new Blob([note.content], { type: "text/markdown" });
    triggerDownload(blob, `${slugify(note.title)}.md`);
  };

  const downloadAllNotes = (notes: Note[]) => {
    const content = notes.map((n) => `${n.content}\n\n---\n`).join("\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const filename = `all_notes_${new Date().toISOString().split("T")[0]}.md`;
    triggerDownload(blob, filename);
  };

  return { downloadNote, downloadAllNotes };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(text: string) {
  return text.replace(/[^a-z0-9]/gi, "_").toLowerCase();
}
