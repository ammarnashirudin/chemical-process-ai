type DashboardHeaderProps = {
  apiOnline: boolean | null;
  checkApi: () => void;
};

export function DashboardHeader({
  apiOnline,
  checkApi,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-400">
            PROCESS INTELLIGENCE
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            Chemical Process AI
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Methane compressibility prediction platform
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              apiOnline === true
                ? "bg-emerald-400"
                : apiOnline === false
                  ? "bg-red-400"
                  : "bg-slate-500"
            }`}
          />
          {apiOnline === true
            ? "API Connected"
            : apiOnline === false
              ? "API Offline"
              : "API Not Checked"}
          <button
            onClick={checkApi}
            className="ml-2 text-cyan-400 hover:text-cyan-300"
          >
            Check
          </button>
        </div>
      </div>
    </header>
  );
}
