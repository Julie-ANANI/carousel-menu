/**
 * Created by bastien on 23/02/2018.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as FileSaver from 'file-saver';


@Injectable({providedIn: 'root'})
export class DownloadService {

  constructor() { }

  static saveCsv(csv: string, fileName: string): Observable<Blob> {
    const file = <Blob> new Blob([csv]);
    return FileSaver.saveAs(file, `${fileName}.csv`);
  }

  static saveJson(json: string, fileName: string): Observable<Blob> {
    const file = <Blob> new Blob([json]);
    return FileSaver.saveAs(file, `${fileName}.json`);
  }

  static savePDF(pdf: string, fileName: string): Observable<Blob> {
    const file = <Blob> new Blob([pdf]);
    return FileSaver.saveAs(file, `${fileName}.pdf`);
  }
}
