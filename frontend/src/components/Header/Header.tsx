import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import TitleInput from "./TitleInput";
import SaveIndicator from "./SaveIndicator";

type HeaderProps = {
  toggleTheme: () => void;
  isDarkMode: boolean;
  title?: string;
  setTitle?: (title: string) => void;
  isEditingNote?: boolean;
  onToggleSidebar?: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
};

export default function Header({
  toggleTheme,
  isDarkMode,
  onToggleSidebar,
  title = "",
  setTitle,
  isEditingNote = false,
  isSaving = false,
  hasUnsavedChanges = false,
}: HeaderProps) {
  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-40 border-b border-zinc-200 dark:border-zinc-700">
      <div className="relative flex items-center justify-center h-16 px-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="absolute left-4 p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {isEditingNote && setTitle && (
          <TitleInput value={title} onChange={setTitle} />
        )}

        <div className="absolute right-4 flex items-center gap-2">
          <SaveIndicator
            isSaving={isSaving}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          <ThemeToggle toggle={toggleTheme} isDark={isDarkMode} />
        </div>
      </div>
    </header>
  );
}
