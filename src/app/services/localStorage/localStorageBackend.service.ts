import { Injectable } from '@angular/core';
import { LocalStorageService } from '@umius/umi-common-component/services/localStorage';

@Injectable()
export class LocalStorageBackendService extends LocalStorageService {


  public setItem (_k: string, _v: string): void {
    // do nothing here
  }

  public getItem (_k: string): string | null {
    return null;
  }

}
