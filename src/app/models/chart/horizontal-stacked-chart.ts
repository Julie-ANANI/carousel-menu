export interface HorizontalStackedChart {
  data?: Array<number>;
  colors?: Array<string>;
  labels: {[lang: string]: Array<string>};
  percentage?: number;
  labelPercentage?: Array<string>;
  validation?: 'Totally Validated';
}

export interface ExecutiveHorizontalStackedChart {
  data: Array<number>;
  colors: Array<string>;
  labels: Array<string>;
  labelPercentage: Array<number>;
}
