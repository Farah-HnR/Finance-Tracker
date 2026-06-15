export default function Input({ label, error, icon: Icon, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-blue-200">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <Icon size={16} />
          </div>
        )}
        <input
          {...props}
          className={`w-full rounded-xl border bg-blue-950/60 px-4 py-3 text-white placeholder-blue-400/50 outline-none transition-all duration-200
            ${Icon ? "pl-10" : ""}
            ${error
              ? "border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-blue-700/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            }`}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
