import { Injectable } from '@angular/core';
import {UmiusLocalStorageBackendService} from '@umius/umi-common-component';

/**
 * UmiusLocalStorageBackendService functions:
 *
 * 1. setItem(_k: string, _v: string): void;
 * 2. getItem(_k: string): string | null;
 */

@Injectable()
export class LocalStorageBackendService extends UmiusLocalStorageBackendService {

}
