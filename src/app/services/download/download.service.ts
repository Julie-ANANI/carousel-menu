/**
 * Created by bastien on 23/02/2018.
 */
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

// TODO check this again
@Injectable({providedIn: 'root'})
export class DownloadService {

  constructor() { }

  static saveCsv(csv: string, fileName: string): any {
    const file = <Blob> new Blob([csv]);
    return FileSaver.saveAs(file, `${fileName}.csv`);
  }

  static saveJson(json: string, fileName: string): any {
    const file = <Blob> new Blob([json]);
    return FileSaver.saveAs(file, `${fileName}.json`);
  }

  static savePDF(pdf: string, fileName: string): any {
    const file = <Blob> new Blob([pdf]);
    return FileSaver.saveAs(file, `${fileName}.pdf`);
  }
}
