import { Injectable } from '@angular/core';
import { AutocompleteService } from '../../services/autocomplete/autocomplete.service';
import { Clearbit } from '../../models/clearbit';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClearbitInputService {

  constructor(private api: AutocompleteService) {}

  getPropositions(name: string): Observable<Clearbit[]> {
    return this.api.get('clearbit/' + name);
  }

}
