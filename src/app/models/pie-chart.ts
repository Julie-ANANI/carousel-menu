export interface PieChart {
  data?: Array<number>;
  colors?: Array<string>;
  labels: {[prop: string]: Array<string>};
  percentage?: number;
  labelPercentage?: Array<string>;
}
