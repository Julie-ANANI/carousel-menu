export interface PieChart {
  data?: Array<number>;
  colors?: Array<string>;
  labels: {[lang: string]: Array<string>};
  percentage?: number;
  labelPercentage?: Array<string>;
}
