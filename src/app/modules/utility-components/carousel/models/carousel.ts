export interface Carousel {

  labelItemPrev?: boolean;

  labelItemNext?: boolean;

  navItem?: boolean;

  images: Array<{
    src: string;
  }>;

  maxOneSlide?: number; // in case of logos.

  type: 'IMAGE' | 'LOGO';

}

