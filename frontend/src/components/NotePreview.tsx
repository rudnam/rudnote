import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
};

export default function NotePreview({ content }: Props) {
  return (
    <div className="md:h-full border border-zinc-300 dark:border-zinc-700 rounded-md p-4 bg-white dark:bg-zinc-800 flex flex-col">
      <h3 className="text-sm font-medium text-zinc-500 mb-2">Live Preview</h3>
      <div className="prose dark:prose-invert prose-zinc max-w-none overflow-y-auto max-h-96 md:max-h-none grow">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
