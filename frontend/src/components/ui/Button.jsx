export default function Button({ children, loading, variant = "primary", ...props }) {
  const base = "w-full rounded-xl py-3 px-6 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]",
    ghost:
      "bg-transparent border border-blue-700/50 text-blue-300 hover:bg-blue-800/30 hover:border-blue-500",
  };

  return (
    <button {...props} disabled={loading || props.disabled} className={`${base} ${variants[variant]}`}>
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>Please wait…</span>
        </>
      ) : children}
    </button>
  );
}
