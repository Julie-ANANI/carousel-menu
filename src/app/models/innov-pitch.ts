import { InnovCard } from './innov-card';

export interface InnovPitch {
  innovationCards?: Array<InnovCard>;
  diffusion?: boolean;
  stage?: number;
  patent?: boolean;
  innovationCompletion?: number;
}
