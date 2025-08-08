import { useRef, useEffect } from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { replaceAll } from "@milkdown/utils";
import { clipboard } from "@milkdown/kit/plugin/clipboard";
import { history } from "@milkdown/kit/plugin/history";
import { indent } from "@milkdown/kit/plugin/indent";
import { prism } from '@milkdown/plugin-prism'

type Props = {
    value: string;
    onChange: (markdown: string) => void;
    postId: string | null;
};

const MilkdownEditorInner = ({ value, onChange, postId }: Props) => {
    const lastPostId = useRef<string | null>(null);
    const lastValue = useRef<string>("");

    const { get } = useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, value);
                ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
                    onChange(markdown);
                    lastValue.current = markdown;
                });
            })
            .use(commonmark)
            .use(listener)
            .use(clipboard)
            .use(history)
            .use(indent)
            .use(prism)
    );

    useEffect(() => {
        const syncEditor = async () => {
            const editor = await get();
            if (!editor) return;

            const postChanged = postId !== lastPostId.current;
            const contentChangedExternally = value !== lastValue.current;

            if (postChanged || contentChangedExternally) {
                editor.action(replaceAll(value));
                lastPostId.current = postId;
                lastValue.current = value;
            }
        };

        syncEditor();
    }, [postId, value, get]);

    return (
        <div
            className={`
                [&_.ProseMirror:focus-visible]:outline-none`}
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