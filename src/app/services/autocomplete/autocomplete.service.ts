import { Injectable } from '@angular/core';
import {UmiusAutocompleteService} from '@umius/umi-common-component';
import {HttpClient} from '@angular/common/http';

/**
 * UmiusAutocompleteService functions:
 *
 * 1. get(params: {query: string, type: string, tagType?: string, internalOnly?: string}):
 *     Observable<UmiusAutoCompleteObjectInterface[]>;
 */

@Injectable({providedIn: 'root'})
export class AutocompleteService extends UmiusAutocompleteService {

  constructor(protected _httpClient: HttpClient) {
    super(_httpClient);
  }

}
