import { ResidualScatterChart } from "./ResidualScatterChart";
import type { ResidualPoint } from "../../types/dashboard";

type ResidualScatterChartsProps = {
  filteredResiduals: ResidualPoint[];
  onPointClick: (point: ResidualPoint) => void;
};

export function ResidualScatterCharts({
  filteredResiduals,
  onPointClick,
}: ResidualScatterChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ResidualScatterChart
        title="Residual vs Predicted Z"
        description="Relationship between predicted compressibilityfactor and residuals"
        xDataKey="z_predicted"
        xName="Predicted Z"
        xLabel="Predicted Z"
        data={filteredResiduals}
        onPointClick={onPointClick}
      />

      <ResidualScatterChart
        title="Residual vs Temperature"
        description="Relationship between operating temperature andprediction residuals"
        xDataKey="temperature_K"
        xName="Temperature"
        xLabel="Temperature (K)"
        data={filteredResiduals}
      />

      <ResidualScatterChart
        title="Residual vs Pressure"
        description="Relationship between operating pressure and prediction residuals"
        xDataKey="pressure_Pa"
        xName="Pressure"
        xLabel="Pressure (MPa)"
        data={filteredResiduals}
      />
    </div>
  );
}
