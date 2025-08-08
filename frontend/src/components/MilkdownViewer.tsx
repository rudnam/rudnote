import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { prism } from "@milkdown/plugin-prism";

type Props = {
    value: string;
};

const MilkdownViewerInner = ({ value }: Props) => {
    useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, value);
                ctx.update("editorViewOptions", (prev) => ({
                    ...(typeof prev === "object" && prev !== null ? prev : {}),
                    editable: () => false,
                }));
            })
            .use(commonmark)
            .use(prism)
    );

    return (
        <div
            className={`milkdown-editor-wrapper 
                text-zinc-900 dark:text-white 
                rounded-xl
                prose dark:prose-invert
            `}
        >
            <Milkdown />
        </div>
    );
};

export const MilkdownViewer = ({ value }: Props) => (
    <MilkdownProvider>
        <MilkdownViewerInner value={value} />
    </MilkdownProvider>
);
