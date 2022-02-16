import {
  UmiusBrandInterface,
  UmiusEnterpriseInterface,
  UmiusGeographicalZoneInterface,
  UmiusIndustryInterface,
  UmiusLogoMediaInterface,
  UmiusPatternInterface
} from '@umius/umi-common-component/models/enterprise';

export interface Pattern extends UmiusPatternInterface {}

export interface LogoMedia extends UmiusLogoMediaInterface {}

export interface Industry extends UmiusIndustryInterface {}

export interface Brand extends UmiusBrandInterface {}

export interface GeographicalZone extends UmiusGeographicalZoneInterface {}

export enum ScopeEnum {
  country = 'country', continent = 'continent', world = 'world'
}

export interface Enterprise extends UmiusEnterpriseInterface {}
