export function DashboardIntro() {
  return (
    <section>
      <p className="text-sm text-cyan-400">ENGINEERING WORKSPACE / 01</p>
      <h2 className="mt-2 text-3xl font-bold">
        Thermodynamic Prediction Dashboard
      </h2>
      <p className="mt-2 max-w-3xl text-slate-400">
        Predict the methane compressibility factor using a trained Random
        Forest model and compare its output with the Peng–Robinson
        equation of state.
      </p>
    </section>
  );
}
