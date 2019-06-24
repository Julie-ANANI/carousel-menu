import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})

export class ProgressBarComponent implements OnInit {

  @Input() set value(value: string) {
    this._value = value;
  }

  @Input() set width(value: string) {
    this._width = value;
  }

  @Input() set height(value: string) {
    this._height = value;
  }

  @Input() set backgroundColor(value: string) {
    this._backgroundColor = value;
  }

  @Input() set enableTooltip(value: boolean) {
    this._enableTooltip = value;
  }

  private _value: string;

  private _width: string;

  private _height: string;

  private _backgroundColor: string;

  private _enableTooltip: boolean;

  constructor() { }

  ngOnInit() {}

  get value(): string {
    return this._value;
  }

  get width(): string {
    return this._width;
  }

  get height(): string {
    return this._height;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  get enableTooltip(): boolean {
    return this._enableTooltip;
  }

}
