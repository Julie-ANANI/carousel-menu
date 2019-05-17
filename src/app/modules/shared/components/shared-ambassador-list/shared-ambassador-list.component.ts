import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Professional } from '../../../../models/professional';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import { AdvSearchService } from "../../../../services/advsearch/advsearch.service";
import { Router } from '@angular/router';
import { ListConfigurations } from "./list-configurations";
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-ambassadors-list',
  templateUrl: './shared-ambassador-list.component.html',
  styleUrls: ['./shared-ambassador-list.component.scss']
})

export class SharedAmbassadorListComponent {

  @Input() set config(value: any) {
    this.loadPros(value);
  }

  @Input() set listType(value: string) {

    switch(value) {

      case('suggestions'):
        this._tableInfos = ListConfigurations.getProfessionalSuggestionConfig();
        this._actions = ['Add to the project'];
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
  @Input() set context(value: any) {
    this._context = value;
  }

  @Output() selectedProsChange = new EventEmitter<any>();

  @Output('callbackNotification') callbackNotification = new EventEmitter<any>();

  private _config: any;

  private _tableInfos: any = null;

  private _actions: Array<string> = [];

  private _total: number;

  private _pros: Array<SelectedProfessional>;

  private _sidebarValue: SidebarInterface = {};

  private _currentPro: Professional = null;

  private _modalDelete = false;

  private _context: any = null;

  private _fetchingError: boolean;

  smartSelect: any = null;

  editUser: { [propString: string]: boolean } = {};

  constructor(private _advSearchService: AdvSearchService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router) { }


  /***
   * At this point the table should be configured (actions and everything)
   * We need "just" to gather the data and inject it to the table so we can
   * allow the table to show data
   * @param config
   */
  public loadPros(config: any): void {

    this._config = config;

    this._advSearchService.getCommunityMembers(this._configToString()).pipe(first()).subscribe((pros: any) => {
      this._pros = pros.result;
      this._total = pros._metadata.totalCount;

      if (this._pros && this._pros.length > 0) {
        this._pros.forEach((pro) => {

          pro.sent = pro.messages && pro.messages.length > 0;

          if(pro['innovations'] && !!pro['innovations'].find( inno => { return this._context['innovationId'] === inno._id;} ) ) {
            pro['self'] = 'true';
          } else {
            pro['self'] = 'false';
          }

        });
      }

      this._loadTableData();

    }, () => {
      this._fetchingError = true;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });

  }


  private _configToString() {
    let config = {};

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
    //this._tableInfos._actions = this._actions;
    // TODO this is ugly AF, shouldn't the table component to be able to update just the data without reloading everything? // Will be fixed in future.
    this._tableInfos = JSON.parse(JSON.stringify(this._tableInfos));
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
    switch (this._actions.findIndex(value => action._action === value)) {

      case 0:
        // This is the add to the project case: the idea is to add the selected pros to the active project
        // If one or more professionals already belong to the project, just add the remaining ones.
        // We need to verify in the back whether a "Kate" campaign exists, otherwise we need to create one and
        // get the id...
        const pros = action._rows.map(pro => { return {_id: pro._id.toString()}; });
        const innovationId = this._context ? this._context.innovationId : null;
        const resultObj = {
          origin: "AMBASSADOR-ADD"
        };
        if(innovationId) {
          this._innovationService.addProsFromCommunity(pros, innovationId).pipe(first())
            .subscribe(result => {
              // Verify the result
              if(!!result) {
                // Notify the parent
                // Close the sidebar (let the parent do that!)
                // Notify the client
                resultObj['result'] = {status:'success', value: result};
              } else {
                // Inform the parent and close the sidebar
                resultObj['result'] = {status:'error', message: "Empty result!"};
              }
              this.callbackNotification.emit(resultObj);
            }, err => {
              // Inform the parent and close the sidebar
              console.error(err);
              resultObj['result'] = {status:'error', message: JSON.stringify(err)};
              this.callbackNotification.emit(resultObj);
            });
        } else {
          //Silently fail
          console.error("Innovation id cannot be null");
          // Inform the parent and close the sidebar
          resultObj['result'] = {status:'error', message: "Innovation id cannot be null"};
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
        console.log(action);
        break;

    }
  }


  selectPro(event): void {
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


  public deleteAmbassador(event: Event) {
    event.preventDefault();
  }


  get total() {
    return this._total;
  }

  get pros() {
    return this._pros;
  }

  get config() {
    return this._config;
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

}
