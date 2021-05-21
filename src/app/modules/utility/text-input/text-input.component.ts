import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {emailRegEx} from '../../../utils/regex';

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

  /**
   * defines the different html styles.
   * TYPE_1: has circle button on the input field. ex: Admin project settings component (Modal Publish to Community)
   * TYPE_2: has normal button attached next to the input filed. Client new project last step component.
   */
  @Input() template: 'TYPE_1' | 'TYPE_2' = 'TYPE_1';

  /**
   * added text list.
   * @param value
   */
  @Input() set addedText(value: Array<string>) {
    this._addedText = value;
  }

  @Input() placeholder = 'COMMON.PLACEHOLDER.INPUT_LIST_DEFAULT';

  /**
   * top value of the btn add for the template TYPE_1.
   * sometimes it's not in center from the top container of input.
   */
  @Input() btnAddTopValue = '';

  /**
   * input field text size.
   */
  @Input() inputTextSize = '16px';

  /***
   * true to make input field and button in center.
   */
  @Input() isFieldCenter = false;

  /**
   * error text color: text-white | text-primary ....
   */
  @Input() errorTextColorClass = 'text-alert';

  /**
   * can be email or password or ....
   */
  @Input() fieldType = 'text';

  /***
   * to make the form field small.
   */
  @Input() isFormSmall = false;

  /**
   * provide the label bg color class.
   */
  @Input() labelBgColor = 'is-draft';

  /**
   * provide the add button color class.
   */
  @Input() buttonColorClass = 'is-primary';

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

  private _isEmailError = false;

  constructor() { }

  public onAddValue() {
    if (this._text.value) {
      if ((this.fieldType === 'email' && this._text.value.match(emailRegEx)) || this.fieldType === 'text') {
        this._isEmailError = false;
        this.textEntered.emit(this._text.value);
        this._text.reset();
      } else if (this.fieldType === 'email' && !this._text.value.match(emailRegEx)) {
        this._isEmailError = true;
      }
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

  get isEmailError(): boolean {
    return this._isEmailError;
  }

}
