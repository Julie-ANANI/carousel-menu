import { ValidatorFn } from '@angular/forms';

export class CompozerComponent<T> {
  public value: T;
  public key: string;
  public label: string;
  public placeholder: string;
  public order: number;
  public compozerType: string;
  public questionType: string;
  public disabled: boolean;
  public validators: ValidatorFn | ValidatorFn[];
  public errorsMessages: any;
  public classAddition: string;
  public prefixIcon: string;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    placeholder?: string,
    order?: number,
    compozerType?: string,
    questionType?: string,
    disabled?: boolean,
    validators?: ValidatorFn | ValidatorFn[],
    errorsMessages?: any,
    classAddition?: string,
    prefixIcon?: string,
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.placeholder = options.placeholder || '';
    this.order = options.order === undefined ? 1 : options.order;
    this.compozerType = options.compozerType || '';
    this.questionType = options.questionType || 'textbox';
    this.disabled = options.disabled;
    this.validators = options.validators || null;
    this.errorsMessages = options.errorsMessages || null;
    this.classAddition = options.classAddition || 's12';
    this.prefixIcon = options.prefixIcon || '';
  }
}
