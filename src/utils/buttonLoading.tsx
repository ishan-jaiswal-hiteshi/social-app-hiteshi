export const LoadingSpinner = () => (
  <div
    className="animate-spin inline-block w-3 h-3 border-[2px] border-current border-t-transparent text-white rounded-full"
    role="status"
    aria-label="loading"
  >
    <span className="sr-only">Loading...</span>
  </div>
);
