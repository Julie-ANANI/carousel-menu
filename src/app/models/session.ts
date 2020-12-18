export interface Session {
  id: string;
  groupID: string;
  authorID: string;
  validUntil?: string;
  lastActivity?: number; // used to detect inactivity
  author: {
    id: string;
    name: string;
    initials: string;
  };
}
