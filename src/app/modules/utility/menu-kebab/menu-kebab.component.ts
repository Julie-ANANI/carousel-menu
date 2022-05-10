import {Component, Input} from '@angular/core';
import {Innovation} from '../../../models/innovation';
import {RouteFrontService} from '../../../services/route/route-front.service';
import {InnovCard} from '../../../models/innov-card';
import {InnovationFrontService} from '../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-menu-kebab',
  templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss']
})
export class MenuKebabComponent {

  @Input() items = [
    'français',
    'anglais',
    'espagnol'
  ];

  @Input() testInput: string;
  @Input() color = '#97A4B1';
  @Input() textColor = '#00B0FF';
  @Input() isActive = false;

  private _project: Innovation = <Innovation>{};
  private _activeTab = this._routeFrontService.activeTab(8, 7);
  private _activeCardIndex = 0;
  private _setActiveCardIndex() {
    this._innovationFrontService.setActiveCardIndex(this._activeCardIndex);
  }
  private _cardToDelete: InnovCard = <InnovCard>{};

  constructor(private _routeFrontService: RouteFrontService,
              private _innovationFrontService: InnovationFrontService) { }

  public setCardLang(value: string) {
    if (this.activeCard && !(this._cardToDelete._id)) {
      this._activeCardIndex = InnovationFrontService.currentLangInnovationCard(this._project, value, 'INDEX');
      this._setActiveCardIndex();
    }
  }


  // public openModal(event: Event, type: 'ADD_LANG' | 'DELETE_LANG' | 'ASK_VALIDATION', deleteCard?: InnovCard) {
  //   event.preventDefault();
  //   this._modelType = type;
  //
  //   switch (type) {
  //
  //     case 'ASK_VALIDATION':
  //       this._showModal = true;
  //       break;
  //
  //     case 'ADD_LANG':
  //       if (this.canAddCard && !this._isAddingCard) {
  //         this._showCardModal = true;
  //       }
  //       break;
  //
  //     case 'DELETE_LANG':
  //       if (!this._isDeletingCard) {
  //         this._cardToDelete = deleteCard;
  //         this._showCardModal = true;
  //       }
  //       break;
  //
  //   }
  // }

  get project(): Innovation {
    return this._project;
  }

  get activeTab(): string {
    return this._activeTab;
  }

  get activeCard(): InnovCard {
    return InnovationFrontService.activeCard(this._project, this._activeCardIndex);
  }

}
