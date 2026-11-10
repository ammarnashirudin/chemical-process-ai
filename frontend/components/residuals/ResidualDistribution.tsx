import type {
  QQPoint,
  ResidualHistogramPoint,
} from "../../types/dashboard";

import { ResidualInterpretation } from "./ResidualInterpretation";
import { ResidualHistogram } from "./ResidualHistogram";
import { ResidualQQPlot } from "./ResidualQQPlot";

type ResidualDistributionProps = {
  residualInterpretation: string;
  residualHistogram: ResidualHistogramPoint[];
  qqPlot: QQPoint[];
};

export function ResidualDistribution({
  residualInterpretation,
  residualHistogram,
  qqPlot,
}: ResidualDistributionProps) {
  return (
    <>
      <ResidualInterpretation
        residualInterpretation={residualInterpretation}
      />

      <ResidualHistogram
        residualHistogram={residualHistogram}
      />

      <ResidualQQPlot qqPlot={qqPlot} />
    </>
  );
}
