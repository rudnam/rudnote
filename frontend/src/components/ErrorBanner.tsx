type ErrorBannerProps = {
  isFetching: boolean;
  onRetry: () => void;
};

export default function ErrorBanner({ isFetching, onRetry }: ErrorBannerProps) {
  return (
    <div className="px-6">
      <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-600 rounded p-3 flex justify-between items-center text-sm">
        <span>Cannot connect to backend. Please check your server.</span>
        <button
          onClick={onRetry}
          disabled={isFetching}
          className="ml-4 px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Retry"}
        </button>
      </div>
    </div>
  );
}
