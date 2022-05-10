import { Component } from '@angular/core';
import {Innovation} from '../../../models/innovation';
import {RouteFrontService} from '../../../services/route/route-front.service';
import {InnovCard} from '../../../models/innov-card';
import {InnovationFrontService} from '../../../services/innovation/innovation-front.service';
import {RolesFrontService} from '../../../services/roles/roles-front.service';

@Component({
  selector: 'app-menu-kebab',
  templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss']
})
export class MenuKebabComponent {

  private _project: Innovation = <Innovation>{};
  private _activeTab = this._routeFrontService.activeTab(8, 7);
  private _activeCardIndex = 0;
  private _setActiveCardIndex() {
    this._innovationFrontService.setActiveCardIndex(this._activeCardIndex);
  }
  private _cardToDelete: InnovCard = <InnovCard>{};
  private _modelType = '';
  private _showModal = false;
  private _isAddingCard = false;
  private _showCardModal = false;
  private _isDeletingCard = false;

  private _username = 'JULIE';

  constructor(private _routeFrontService: RouteFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _rolesFrontService: RolesFrontService) { }

  public setCardLang(value: string) {
    if (this.activeCard && !(this._cardToDelete._id)) {
      this._activeCardIndex = InnovationFrontService.currentLangInnovationCard(this._project, value, 'INDEX');
      this._setActiveCardIndex();
    }
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public openModal(event: Event, type: 'ADD_LANG' | 'DELETE_LANG' | 'ASK_VALIDATION', deleteCard?: InnovCard) {
    event.preventDefault();
    this._modelType = type;

    switch (type) {

      case 'ASK_VALIDATION':
        this._showModal = true;
        break;

      case 'ADD_LANG':
        if (this.canAddCard && !this._isAddingCard) {
          this._showCardModal = true;
        }
        break;

      case 'DELETE_LANG':
        if (!this._isDeletingCard) {
          this._cardToDelete = deleteCard;
          this._showCardModal = true;
        }
        break;

    }
  }

  get user() {
    return this._username;
  };

  get project(): Innovation {
    return this._project;
  }

  get showLangDrop(): boolean {
    return this._project.innovationCards && this._project.innovationCards.length > 1;
  }

  get activeTab(): string {
    return this._activeTab;
  }

  get activeCard(): InnovCard {
    return InnovationFrontService.activeCard(this._project, this._activeCardIndex);
  }

  get canAddCard(): boolean {
    return this._project.innovationCards && this._project.innovationCards.length === 1;
  }

  get isDeletingCard(): boolean {
    return this._isDeletingCard;
  }

  get canEditDescription(): boolean {
    return this.canAccess(['settings', 'edit', 'description']);
  }

  get modelType(): string {
    return this._modelType;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  get showCardModal(): boolean {
    return this._showCardModal;
  }
}
