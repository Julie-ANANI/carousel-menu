import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent {

  @Input() set showModal(value: boolean) {
    this._show = value;
  }

  @Input() set maxWidth(value: string) {
    this._maxWidth = value;
  }

  @Input() set title(value: string) {
    this._title = value;
  }

  @Input() set enableCloseButton(value: boolean) {
    this._enableCloseButton = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _show: boolean = false;

  private _maxWidth: string = '640px';

  private _title: string = '';

  private _enableCloseButton: boolean = false;

  public toggleState(event: Event) {
    const classesToCheck: Array<string> = ['modal-overlay', 'modal-close is-sm', 'button modal-cancel', 'close'];
    const { className } = (event.target as any);

    if (classesToCheck.indexOf(className) !== -1) {
      this.showModalChange.emit(false);
    }

  }

  get showModal() {
    return this._show;
  }

  get maxWidth(): string {
    return this._maxWidth;
  }

  get title(): string {
    return this._title;
  }

  get enableCloseButton(): boolean {
    return this._enableCloseButton;
  }

}
