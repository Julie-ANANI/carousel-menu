import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocalStorageService {


  public setItem(k: string, v: string): void {
    localStorage.setItem(k, v);
  }

  public getItem(k: string): string | null {
    return localStorage.getItem(k);
  }

}
