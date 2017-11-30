/**
 * Created by juandavidcruzgomez on 29/11/2017.
 */

import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LatexService {

  constructor(private _http: Http) {
  }

  public checkJob(jobId: string): Observable<any> {
    return this._http.get(`/latex/checkJob/${jobId}`)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public downloadJob(jobId: string, jobType: string, fileName: string): Observable<any> {
    //let requestOptions: RequestOptionsArgs;
    //requestOptions.responseType = ResponseContentType.Blob;
    return this._http.download(`/latex/job?jobId=${jobId}&jobType=${jobType}&fileName=${fileName}`)
      .map((res: Response) => res.blob())
      .catch((error: Response) => {
        console.error(error);
        return Observable.throw(error.text())
      });
  }


}
