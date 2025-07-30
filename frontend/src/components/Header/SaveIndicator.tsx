import { Check, Loader2, AlertTriangle } from "lucide-react";

type SaveIndicatorProps = {
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
};

export default function SaveIndicator({
  isSaving,
  hasUnsavedChanges,
}: SaveIndicatorProps) {
  if (isSaving) {
    return (
      <span title="Saving...">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      </span>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <span title="Unsaved changes">
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
      </span>
    );
  }

  return (
    <span title="All changes saved">
      <Check className="w-4 h-4 text-green-500" />
    </span>
  );
}
