import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-shared-innovation-card-langmodal',
  templateUrl: './shared-innovation-card-langmodal.component.html',
  styleUrls: ['./shared-innovation-card-langmodal.component.scss']
})
export class SharedInnovationCardLangmodalComponent implements AfterViewInit {
  // TODO vérifier si on peut supprimer ce module

  @Input() public langOptions;
  @Input() public selectLangOfCardInput;
  @Input() public wantTo: string;
  @Input() public haveToOpen = true;

  @Output() public addModif = new EventEmitter ();
  @Output() public langOfCard = new EventEmitter ();
  @Output() public closed = new EventEmitter ();
  @Output() public createCard = new EventEmitter ();
  @Output() public save = new EventEmitter ();
  @Output() public setLangInput = new EventEmitter ();

  public modalActions = new EventEmitter<any> ();

  constructor() { }

  ngAfterViewInit() {
    if (this.haveToOpen) {
      this.open();
    }
  }

  onModalAgree() {
    if (this.wantTo === 'create') {
      this.createCard.emit(true);
    }
    else {
      this.langOfCard.emit(this.selectLangOfCardInput);
      this.addModif.emit('innovationCard.lang');
      this.save.emit(true);
    }
    this.haveToOpen = false;
  }

  // MODAL ACTIONS
  open() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  close() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

}
