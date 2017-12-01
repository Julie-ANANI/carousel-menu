import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { NotificationsService } from 'angular2-notifications';
import { LatexService } from '../../../../services/latex/latex.service';
import { initTranslation, TranslateService } from './i18n/i18n';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'pdf-generator',
  templateUrl:  './shared-latex-manager.component.html'
})


export class SharedLatexManagerComponent implements OnInit {

  @Input() model: {lang: string, jobType: string, labels: string, pdfDataseedFunction: any, compilingStatus: any};

  private _compiling: boolean = false;
  private _recheck: boolean = false;
  private _checkInterval = null;

  private _fileName = "";

  constructor(private _innovationService: InnovationService,
              private _latexService: LatexService,
              private _notificationsService: NotificationsService,
              private _translateService: TranslateService,) { }

  ngOnInit() {
    initTranslation(this._translateService);
    //Verify that we have received have all we need
    this._fileName = this.model.pdfDataseedFunction.title;
    console.log(this.model);
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
    this.model.compilingStatus("Started the compiling process!");
    this._generateInnovationCard();
    console.log(`Starting job: ${event}`);
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
    this._recheck = false;
  }

  /**
   * Asks latex service for an innovation card
   * @private
   */
  private _generateInnovationCard() {
    this._innovationService.exportPDF(this.model.pdfDataseedFunction.projectId,
      this.model.pdfDataseedFunction.innovationCardId, {lang:'en', force: true})
      .subscribe(exportServiceResp => {
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
            this._recheck = false;
            console.error(ex);
          }
        },
        error => this._notificationsService.error('Error', error.message)
      );
  }

  private _download(conf) {
    if (conf['jobId'] && conf['jobType']) {
      this._latexService.downloadJob(conf['jobId'], conf['jobType'], "test.pdf")
        .subscribe(file=>{
            FileSaver.saveAs(file, this._fileName || 'test.pdf');
            this._stopClock();
        },
          error=>{
            this._stopClock();
            this._notificationsService.error('Error', error.message);
          });
    }
  }

  /**
   * Check the job status
   * @param info
   * @private
   */
  private _checkFunc(jobId) {
    if(this._recheck){
      const id = jobId;
      this._latexService.checkJob(id).subscribe(
        result=>{
          if(result && result['status']){
            try {
              result = JSON.parse(result['status']);
              var procStatus = result['status'];
              switch (procStatus) {
                case('GENERATED'):
                  //Stop the checking and download the thing (or make the url available)
                  this._recheck = false;
                  this._download({
                    'jobId': result['jobId'],
                    'jobType': result['jobType']
                  });
                  break;
                case('QUEUED'):
                  //Wait a little and check again
                  this._recheck = true;
                  setTimeout(function(){
                    console.log("Checking again for job " + result['jobId']);
                    //$rootScope.$broadcast('check', info);
                  }, 5000);
                  break;
                case('ERROR'):
                  //Report the error (activate the icon of death)
                  this._recheck = false;
                  break;
                default:
                //Reset everything
              }
            }catch(ex) {
              this._stopClock();
              console.error(ex);
            }
          } else if(result && result['error']) {
            //Report the error (activate the icon of death)
            this._notificationsService.error('Error', result['error']);
          }
        },
        error=>{
          this._stopClock();
          this._notificationsService.error('Error', error.message);
        }
      );
    }
  }
}
