export interface PieChartLabel {
  lang: string;
  value: Array<string>;
}

// TODO remove multiling
export interface PieChart {
  data?: Array<number>;
  colors?: Array<string>;
  percentage?: number;
  labelPercentage?: Array<string>;

  /**
   * TODO replace this with Array<PieChartLabel>
   * current {[lang: string]: Array<string>}
   */
  labels: any;
}

export interface ExecutivePieChart {
  data: Array<number>;
  colors: Array<string>;
  labels: Array<string>;
  labelPercentage: Array<number>;
}
