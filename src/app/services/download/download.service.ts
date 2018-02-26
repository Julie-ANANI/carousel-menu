/**
 * Created by bastien on 23/02/2018.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as FileSaver from 'file-saver';


@Injectable()
export class DownloadService {

  constructor() { }

  public saveCsv(csv: string, fileName: string): Observable<Blob> {
    const file = <Blob> new Blob([csv]);
    return FileSaver.saveAs(file, `${fileName}.csv`);
  }
}
