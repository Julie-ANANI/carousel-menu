import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Professional } from '../../../../models/professional';
import { SidebarInterface } from '../../../sidebars/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import { AdvSearchService } from '../../../../services/advsearch/advsearch.service';
import { Router } from '@angular/router';
import { ListConfigurations } from './list-configurations';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { ContextInterface } from '../../../user/admin/components/admin-community/interfaces/context-interface';
import { Config } from '@umius/umi-common-component/models';
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../services/error/error-front.service";

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
  self: 'true' | 'false';
}

@Component({
  selector: 'app-shared-ambassadors-list',
  templateUrl: './shared-ambassador-list.component.html',
})

export class SharedAmbassadorListComponent {

  @Input() set config(value: Config) {
    this.loadPros(value);
  }

  @Input() set listType(value: string) {

    switch (value) {

      case('suggestions'):
        this._tableInfos = ListConfigurations.getProfessionalSuggestionConfig();
        this._tableInfos._button = [{_label: 'Add', _icon: 'fas fa-plus'}];
        break;

      case('default'):

      default:
        this._tableInfos = ListConfigurations.getByDefaultConfig();
        break;

    }

  }

  /**
   * The context is a set of variables not directly related to the data in the table
   * but that can help find other information to operate with. For example, what's the
   * innovation or the campaign where the professionals will be added.
   * Of course, the context can be null, in which case the operation will be performed
   * at the whole collection scope.
   * @param value
   */
  @Input() set context(value: ContextInterface) {
    this._context = value;
  }

  @Output() selectedProsChange = new EventEmitter<any>();

  @Output('callbackNotification') callbackNotification = new EventEmitter<any>();

  private _config: any;

  private _tableInfos: any;

  private _total: number;

  private _pros: Array<SelectedProfessional>;

  private _sidebarValue: SidebarInterface = {};

  private _currentPro: Professional = null;

  private _modalDelete = false;

  private _context: ContextInterface = null;

  private _fetchingError: boolean;

  private _prosToRemoves: Array<Professional> = [];

  smartSelect: any = null;

  editUser: { [propString: string]: boolean } = {};

  constructor(private _advSearchService: AdvSearchService,
              private _professionalService: ProfessionalsService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router) { }


  /***
   * At this point the table should be configured (actions and everything)
   * We need "just" to gather the data and inject it to the table so we can
   * allow the table to show data
   * @param config
   */
  public loadPros(config: Config): void {

    this._config = config;

    this._advSearchService.getCommunityMembers(this._configToString()).pipe(first()).subscribe((pros: any) => {
      this._pros = pros.result;
      this._total = pros._metadata.totalCount;

      if (this._pros && this._pros.length > 0) {
        this._pros.forEach((pro) => {

          pro.sent = pro.messages && pro.messages.length > 0;

          if (!!pro.innovations && !!pro.innovations.find( (inno) => this._context['innovationId'] === inno._id ) ) {
            pro.self = 'true';
          } else {
            pro.self = 'false';
          }

        });
      }

      this._loadTableData();

    }, (err: HttpErrorResponse) => {
      this._fetchingError = true;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
    });

  }


  private _configToString() {
    const config: any = {};
    Object.keys(this._config).forEach(key => {
      if (this._config[key] instanceof Object) {
        config[key] = JSON.stringify(this._config[key]);
      } else {
        config[key] = this._config[key];
      }
    });
    return config;
  }


  private _loadTableData() {
    this._tableInfos._content = this._pros;
    this._tableInfos._total = this._total;
  }


  /***
   * this function is to redirect to the component to AdminCommunityMember
   * which will show all its details. Called by clicking on the show button.
   * @param pro
   */
  onClickEdit(pro: Professional) {
    if (pro._id) {
      this._router.navigate([`user/admin/community/members/${pro._id}`]);
    }
  }


  public performActions(action: any) {
    switch (action._label) {

      case 'Add':
        // This is the add to the project case: the idea is to add the selected pros to the active project
        // If one or more professionals already belong to the project, just add the remaining ones.
        // We need to verify in the back whether a "Kate" campaign exists, otherwise we need to create one and
        // get the id...
        const pros = action._rows.map((pro: Professional) => ({_id: pro._id.toString()}));
        const innovationId = this._context ? this._context.innovationId : null;
        const resultObj: any = {
          origin: 'AMBASSADOR-ADD'
        };
        if (innovationId) {
          this._innovationService.addProsFromCommunity(pros, innovationId).pipe(first())
            .subscribe(result => {
              // Verify the result
              if (!!result) {
                // Notify the parent
                // Close the sidebar (let the parent do that!)
                // Notify the client
                resultObj.result = {status: 'success', value: result};
              } else {
                // Inform the parent and close the sidebar
                resultObj.result = {status: 'error', message: 'Empty result!'};
              }
              this.callbackNotification.emit(resultObj);
            }, err => {
              // Inform the parent and close the sidebar
              console.error(err);
              resultObj.result = {status: 'error', message: JSON.stringify(err)};
              this.callbackNotification.emit(resultObj);
            });
        } else {
          // Silently fail
          console.error('Innovation id cannot be null');
          // Inform the parent and close the sidebar
          resultObj.result = {status: 'error', message: 'Innovation id cannot be null'};
          this.callbackNotification.emit(resultObj);
        }
        break;

      case 1:
        /*if(action._rows.length) {
          if(action._rows.length > 1) {
            console.log("Look man, I could do this action just for the first one...");
          }
          const link = `/user/admin/community/members/${action._rows[0]._id}`;
          this.router.navigate([link]);
        } else {
          console.error("What? empty rows? How did you do that?");
        }*/
        break;

    }
  }


  selectPro(event: any): void {
    this.selectedProsChange.emit({
      total: event._rows.length,
      pros: event._rows
    });
  }


  updateSelection(event: any) {
    this.smartSelect = event;
    const config = this._config;
    config.offset = this.smartSelect.offset;
    config.limit = this.smartSelect.limit;
    this.selectedProsChange.emit({
      total: this.nbSelected,
      pros: 'all',
      query: config
    });
  }


  get nbSelected(): number {
    if (this.smartSelect) {
      return (this.smartSelect.limit + this.smartSelect.offset) > this._total ?
        this._total - this.smartSelect.offset :
        this.smartSelect.limit;
    }
    return this._pros ? this._pros.filter(p => p.isSelected).length : 0;
  }


  updatePro(pro: Professional): void {
    this.editUser[pro._id] = false;
  }



  public onClickRemove(value: Array<Professional>) {
    this._prosToRemoves = value;
    this._modalDelete = true;
  }


  public deleteAmbassador(event: Event) {
    event.preventDefault();

    if (this._context && this._context.deleteType === 'Campaign') {
      this._deleteFromCampaign();
    } else if (!this._context) {
      this._deleteProfessional();
    }

    this._modalDelete = false;

  }


  private _deleteFromCampaign() {
    if (this._context.campaignId && this._context.innovationId) {
      this._prosToRemoves.forEach((pro: Professional) => {
        this._professionalService.removeFromCampaign(pro._id, this._context.campaignId, this._context.innovationId).subscribe(() => {
          this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.AMBASSADOR.DELETED');
        }, () => {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
        });
      });
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'We do not have sufficient information\'s to delete this ambassador.');
    }
  }


  private _deleteProfessional() {
    this._prosToRemoves.forEach((pro: Professional) => {
      this._professionalService.remove(pro._id).subscribe(() => {
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.AMBASSADOR.DELETED');
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
      });
    });
  }



  get total() {
    return this._total;
  }

  get pros() {
    return this._pros;
  }

  get config(): Config {
    return this._config;
  }

  get context(): ContextInterface {
    return this._context;
  }

  get tableInfos(): any {
    return this._tableInfos;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get currentPro(): Professional {
    return this._currentPro;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get prosToRemoves(): Array<Professional> {
    return this._prosToRemoves;
  }

}
