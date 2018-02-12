import { Cloudinary } from './cloudinary';

export interface Video {
  readonly provider: 'youtube' | 'vimeo';
  readonly thumbnail: string;
  readonly embeddableUrl: string;
  readonly public_id: string;
  readonly url: string;
}

export interface Media {
  readonly id: string;
  readonly _id: string;
  readonly format: string;
  readonly type: 'PHOTO' | 'VIDEO' | 'TEXT';
  readonly name: string;
  readonly url: string;
  readonly cloudinary: Cloudinary;
  readonly video: Video;
}
