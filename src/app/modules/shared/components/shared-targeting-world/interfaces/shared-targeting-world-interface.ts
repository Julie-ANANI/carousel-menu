import { Country } from '../../../../../models/country';

export interface SharedTargetingWorldInterface {
  includeContinents?: Array<string>;
  includeCountries?: Array<Country>;
  excludeCountries?: Array<Country>;
}
