import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  /**
   * store the key-value pairs of request and response.
   * @private
   */
  private _cache: Map<string, HttpResponse<any>> = new Map<string, HttpResponse<any>>();

  constructor() { }

  /**
   * return the value from the _cache object based on the URL
   * @param url
   */
  public get(url: string): HttpResponse<any> | undefined {
    return this._cache[url];
  }

  /**
   * set the new key-value pair for the new response and URL.
   * @param url
   * @param response
   */
  public set(url: string, response: HttpResponse<any>): void {
    this._cache[url] = response;
  }

  /**
   * clear all the cached data.
   */
  public clearCache(): void {
    this._cache = new Map<string, HttpResponse<any>>();
  }

  /**
   * delete the entry from the cached data.
   * @param url
   */
  public delete(url: string): void {
    delete this._cache[url];
  }

}
