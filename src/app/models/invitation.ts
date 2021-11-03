export interface Invitation {
  readonly _id: string;
  readonly domain: string;
  readonly innovation: string;
  readonly invitation_used: boolean;
  readonly invitee_email: string;
  readonly inviter: string;
}
