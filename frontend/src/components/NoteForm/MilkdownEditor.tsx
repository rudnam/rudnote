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
        text-zinc-900 dark:text-white 
        rounded-xl p-4
        prose dark:prose-invert max-w-none 
        [&_.ProseMirror:focus]:outline-none 
        [&_.ProseMirror:focus-visible]:outline-none
        min-h-full

        [&_.ProseMirror]:min-h-[70vh]
        [&_.ProseMirror]:h-full 
        [&_.ProseMirror]:w-full 
        [&_.ProseMirror]:cursor-text
      `}
      data-testid="editor"
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
