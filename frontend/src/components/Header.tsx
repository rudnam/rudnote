type Props = {
  toggleTheme: () => void;
  isDarkMode: boolean;
};

export default function Header({ toggleTheme, isDarkMode }: Props) {
  return (
    <header className="h-[72px] px-6 md:px-16 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Minimal Markdown Editor
        </p>
      </div>

      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
          className="sr-only"
        />
        <div className="w-10 h-5 bg-zinc-300 dark:bg-zinc-700 rounded-full relative transition">
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              isDarkMode ? "translate-x-5" : ""
            }`}
          />
        </div>
      </label>
    </header>
  );
}
