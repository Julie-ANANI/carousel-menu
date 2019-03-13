export interface AmbassadorPosition {
  name?: string;
  alias?: string;
}

export const ambassadorPosition: Array<AmbassadorPosition> = [
  { name:  'academic', alias: 'Academic / Researcher' },
  { name:  'consultant', alias: 'Consultant' },
  { name:  'freelance', alias: 'Entrepreneur / Freelance' },
  { name:  'operational', alias: 'Operational' },
  { name:  'other', alias: 'Other' },
  { name:  'business', alias: 'Sales / Business Dev. / Marketing / HR' },
  { name:  'management', alias: 'Upper management' }
];