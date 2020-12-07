export interface Session {
  id: string;
  groupID: string;
  validUntil?: string;
  author: {
    id: string;
    name: string;
    initials: string;
  };
}
