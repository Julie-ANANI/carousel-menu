/***
 * primary: default color of the icon for the application
 */

export const picto: Picto = {
  edit: {
    blue: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-edit.svg',
    white: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-edit-white.svg'
  },
  eye: {
    primary: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-eye.svg'
  },
  example: {
    primary: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-example.svg'
  },
  save: {
    primary: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-save.svg'
  },
  badgeUmi: 'https://res.cloudinary.com/umi/image/upload/app/default-images/badges/badge-umi.svg'
}

interface PictoColors {
  blue?: string;
  white?: string;
  primary?: string;
}

export interface Picto {
  edit: PictoColors;
  eye: PictoColors;
  save: PictoColors;
  example: PictoColors;
  badgeUmi: string;
}
