/***
 * primary: default color of the icon for the application
 */

export interface Picto {
  edit: {
    blue: string;
    white: string;
  };
  save: {
    primary: string;
  };
  badgeUmi: string;
}

export const picto: Picto = {
  edit: {
    blue: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-edit.svg',
    white: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-edit-white.svg'
  },
  save: {
    primary: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-save.svg'
  },
  badgeUmi: 'https://res.cloudinary.com/umi/image/upload/app/default-images/badges/badge-umi.svg'
}
