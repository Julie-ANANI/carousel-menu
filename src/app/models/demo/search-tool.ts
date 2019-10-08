export interface SearchTool {
  metadata?: {
    (s: string): number;
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
