import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { LatexService } from '../../../../services/latex/latex.service';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'pdf-generator',
  templateUrl:  './shared-latex-manager.component.html'
})


export class SharedLatexManagerComponent implements OnInit {

  @Input() model: {lang: string, jobType: string, labels: string, pdfDataseedFunction: any};

  private _compiling: boolean = false;
  private _recheck: boolean = false;
  private _checkInterval = null;

  private _fileName = "";

  constructor(private _innovationService: InnovationService,
              private _latexService: LatexService,
              private _notificationsService: TranslateNotificationsService) {  }

  ngOnInit() {
  }

  /**
   * Accessor to compiling status
   * @returns {boolean}
   */
  public isCompiling(): boolean {
    return this._compiling;
  }

  /**
   * Process the view event
   * @param event
   */
  public startJob(event): void {
    this._fileName = this.model.pdfDataseedFunction.title;
    if(!this.isCompiling()) {
      switch(this.model.jobType) {
        case('inventionCard'):
          this._generateInnovationCard();
          break;
        case('synthesis'):
          this._generateSynthesis();
          break;
        default:
          console.error(`The job type '${this.model.jobType}' is not a known pdf export type.`);
      }
    }
  }

  /**
   * Starts the checking clock
   * @param jobId
   * @private
   */
  private _startJobClock(jobId: any) {
    let count = 0;
    if(this._checkInterval) {
      clearInterval(this._checkInterval);
      this._checkInterval = null;
    }
    this._checkInterval = setInterval(()=>{
      this._checkFunc(jobId);
      console.log(`Checking: ${Date.now()} (${count})`);
      count++;
    }, 5000);
  }

  /**
   * Stops the checking clock
   * @private
   */
  private _stopClock() {
    if(this._checkInterval) {
      clearInterval(this._checkInterval);
      this._checkInterval = null;
    }
    this._compiling = false;
    this._recheck = false;
  }

  /**
   * Takes and process a generic response from latex service
   * @param exportServiceResp
   * @private
   */
  private _processResponse(exportServiceResp: any) {
    try{
      let result = JSON.parse(exportServiceResp['status']);
      if(result['status']==='QUEUED'){
        this._recheck = true;
        this._startJobClock(result['jobId']);
      } else {
        this._download({
          'jobId': result['jobId'],
          'jobType': result['jobType']
        });
      }
    }catch(ex) {
      this._stopClock();
      console.error(ex);
    }
  }

  /**
   * Manages the generic error response
   * @param error
   * @private
   */
  private _errorManager(error: any) {
    this._stopClock();
    this._notificationsService.error('ERROR.ERROR', error.message);
  }

  /**
   * Asks latex service to generate the syntheis pdf document
   * @private
   */
  private _generateSynthesis() {
    this._compiling = true;
    this._innovationService.exportSynthesis(this.model.pdfDataseedFunction.projectId, this.model.lang)
      .subscribe(exportServiceResp => {
        this._processResponse(exportServiceResp);
      }, error => {
        this._errorManager(error);
      });
  }

  /**
   * Asks latex service for an innovation card
   * @private
   */
  private _generateInnovationCard() {
    this._compiling = true;
    this._innovationService.exportPDF(this.model.pdfDataseedFunction.projectId,
      this.model.pdfDataseedFunction.innovationCardId, {lang:'en', force: true})
      .subscribe(exportServiceResp => {
        this._processResponse(exportServiceResp);
      }, error => {
        this._errorManager(error);
      });
  }

  /**
   * If the job is done, download the file
   * @param conf
   * @private
   */
  private _download(conf) {
    if (conf['jobId'] && conf['jobType']) {
      this._latexService.downloadJob(conf['jobId'], conf['jobType'])
        .subscribe(file=>{
            FileSaver.saveAs(file, this._fileName || 'test.pdf');
            this._stopClock();
        },
          error=>{
            this._stopClock();
            this._notificationsService.error('ERROR.ERROR', error.message);
          });
    }
  }

  /**
   * Check the job status
   * @param jobId
   * @private
   */
  private _checkFunc(jobId) {
    if(this._recheck){
      this._latexService.checkJob(jobId).subscribe(
        result=>{
          if(result && result['status']){
            try {
              result = JSON.parse(result['status']);
              const procStatus = result['status'];
              switch (procStatus) {
                case('GENERATED'):
                  //Stop the checking and download the thing (or make the url available)
                  this._recheck = false;
                  this._download({
                    'jobId': result['jobId'],
                    'jobType': result['jobType']
                  });
                  break;
                case('ERROR.ERROR'):
                  //Report the error (activate the icon of death)
                  this._recheck = false;
                  break;
                case('QUEUED'):
                  console.log("Job's still queued");
                  break;
                default:
                //Reset everything
              }
            }catch(ex) {
              console.error(ex);
              this._stopClock();
            }
          } else if(result && result['ERROR.ERROR']) {
            //Report the error (activate the icon of death)
            this._notificationsService.error('ERROR.ERROR', result['error']);
          }
        },
        error=>{
          this._stopClock();
          this._notificationsService.error('ERROR.ERROR', error.message);
        });
    }
  }
}
