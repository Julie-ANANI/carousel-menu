import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

/**
 * contains the input field and add button inside the input field.
 * It emits the entered text into the input field.
 *
 * example: Admin project settings component (Modal Publish to Community).
 */

@Component({
  selector: 'app-utility-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {

  @Input() set addedText(value: Array<string>) {
    this._addedText = value;
  }

  @Input() placeholder = 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';

  /***
   * to make the form field small.
   */
  @Input() isFormSmall = false;

  /**
   * max width of the input field.
   */
  @Input() inputMaxWidth = '500px';

  /**
   * provide the label bg color class.
   */
  @Input() labelBgColor = 'is-draft';

  /**
   * entered input field text
   */
  @Output() textEntered: EventEmitter<string> = new EventEmitter<string>();

  /**
   * text to remove when clicked on the cross button from the list of texts entered.
   */
  @Output() valueToRemove: EventEmitter<string> = new EventEmitter<string>();

  private _text: FormControl = new FormControl();

  private _addedText: Array<string> = [];

  constructor() { }

  public onAddValue() {
    if (this._text.value) {
      this.textEntered.emit(this._text.value);
      this._text.reset();
    }
  }

  public removeText(value: string) {
    this._addedText = this._addedText.filter((text) => text !== value);
    this.valueToRemove.emit(value);
  }

  get text(): FormControl {
    return this._text;
  }

  get addedText(): Array<string> {
    return this._addedText;
  }

}
