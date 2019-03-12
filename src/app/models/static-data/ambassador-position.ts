export interface AmbassadorPosition {
  name?: string;
  alias?: string;
}

export const ambassadorPosition: Array<AmbassadorPosition> = [
  { name:  'operational', alias: 'Operational' },
  { name:  'junior', alias: 'Junior' },
  { name:  'senior', alias: 'Senior' },
  { name:  'confirmed', alias: 'Confirmed' },
  { name:  'influencer', alias: 'Influencer' }
];
