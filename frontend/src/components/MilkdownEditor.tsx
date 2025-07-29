import { useRef, useEffect } from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { replaceAll } from "@milkdown/utils";
import { clipboard } from "@milkdown/kit/plugin/clipboard";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  noteId: string | null;
};

const MilkdownEditorInner = ({ value, onChange, noteId }: Props) => {
  const lastNoteId = useRef<string | null>(null);

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, value);
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
          onChange(markdown);
        });
      })
      .use(commonmark)
      .use(listener)
      .use(clipboard)
  );

  useEffect(() => {
    if (noteId === lastNoteId.current) return;
    lastNoteId.current = noteId;

    const editor = get();
    if (!editor) return;

    editor.action(replaceAll(value));
  }, [noteId, value, get]);

  return (
    <div
      className={`
        milkdown-editor-wrapper 
        bg-white dark:bg-zinc-800 
        text-zinc-900 dark:text-white 
        border border-zinc-300 dark:border-zinc-700 
        rounded-xl p-4 shadow-sm 
        prose dark:prose-invert max-w-none 
        [&_.ProseMirror:focus]:outline-none 
        [&_.ProseMirror:focus-visible]:outline-none
      `}
    >
      <Milkdown />
    </div>
  );
};

export const MilkdownEditor = (props: Props) => (
  <MilkdownProvider>
    <MilkdownEditorInner {...props} />
  </MilkdownProvider>
);
