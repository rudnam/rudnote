export const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
    <div className="flex flex-col items-center justify-center h-48 space-y-2">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-zinc-600">{text}</p>
    </div>
);
