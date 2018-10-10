import { Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';

@Injectable()
export class LocalStorageBackendService extends LocalStorageService {


  public setItem (_k: string, _v: string): void {
    // do nothing here
  }

  public getItem (k: string): string {
    return null;
  }

}
