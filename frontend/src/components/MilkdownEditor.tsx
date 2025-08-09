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
import { upload, uploadConfig, type Uploader } from '@milkdown/kit/plugin/upload';
import { API_URL } from "../consts";

type Props = {
    value: string;
    onChange: (markdown: string) => void;
    postId: string | null;
};

const MilkdownEditorInner = ({ value, onChange, postId }: Props) => {
    const lastPostId = useRef<string | null>(null);
    const lastValue = useRef<string>("");

    const uploader: Uploader = async (files, schema) => {
        const imageFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (!file) continue;
            if (!file.type.startsWith("image/")) continue;
            imageFiles.push(file);
        }

        const nodes = await Promise.all(
            imageFiles.map(async (image) => {
                const formData = new FormData();
                formData.append("file", image);

                console.log("going to fetch")
                const res = await fetch(`${API_URL}/uploads`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error(`Upload failed: ${res.statusText}`);
                }
                console.log("fetched!");

                const data = await res.json();
                console.log("data", data);

                return schema.nodes.image.createAndFill({
                    src: data.url,
                    alt: image.name,
                })!;
            })
        );

        return nodes;
    };

    const { get } = useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                ctx.set(defaultValueCtx, value);
                ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
                    onChange(markdown);
                    lastValue.current = markdown;
                });
                ctx.update(uploadConfig.key, (prev) => ({
                    ...prev,
                    uploader,
                    enableHtmlFileUploader: true,
                }));
            })
            .use(commonmark)
            .use(listener)
            .use(clipboard)
            .use(history)
            .use(indent)
            .use(prism)
            .use(upload)
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
        <div className={`[&_.ProseMirror:focus-visible]:outline-none`}>
            <Milkdown />
        </div>
    );
};

export const MilkdownEditor = (props: Props) => (
    <MilkdownProvider>
        <MilkdownEditorInner {...props} />
    </MilkdownProvider>
);
