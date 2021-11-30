export interface StatsInterface {
  heading: string;
  content: Array<{
    subHeading: string;
    value: string;
    stats?: {
      title: string,
      values: any
    },
    gauge?: {
      title: string,
      negative?: boolean;
      referent: number,
      delimitersLabels?: string[]
    };
  }>;
}
