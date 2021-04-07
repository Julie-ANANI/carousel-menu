import {Tag} from './tag';

export type PublicationType = 'pain_point' | 'innovation' | 'sourcing' | '';

export type PublicationSectionType = 'ISSUE' | 'SOLUTION' | 'SUMMARY';

export interface CommunityCircle {
  readonly _id: string;
  readonly name: string;
}

export interface CommunityUser {
  readonly _id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface Community {
  publicationType: PublicationType;
  visibility: string;

  /**
   * we do not store this value in the back.
   * It's for the front only.
   */
  owner: string;

  /**
   * it will always store the media reference but as we send
   * the File before uploading to the cloudinary to the back.
   * Admin project settings modal.
   */
  medias: Array<any>;

  /**
   * in the community they represents the domains.
   */
  sectors: Array<Tag>;

  /**
   * in the community for the hashtags
   */
  tags?: Array<string>;

  /**
   * here type is not the innov card section type. Its community section type.
   */
  sections: Array<{
    type: PublicationSectionType;
    id: string;
  }>;
}
