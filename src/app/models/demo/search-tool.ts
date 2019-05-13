export interface SearchTool {
  metadata?: {
    world?: number;
    asia?: number;
    africa?: number;
    oceania?: number;
    europe?: number;
    northAmerica?: number;
    southAmerica?: number;
  },

  pros?: Array<{
    readonly country?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileUrl: string;
    readonly jobTitle: string;
    email?: string;
    company?: string;
    companyDomain?: string;
    isLoading?: boolean;
  }>

}
