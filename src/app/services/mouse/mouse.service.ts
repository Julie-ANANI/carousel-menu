/***
 * this service is to listen the mouse click event on the page. With this
 * will get the container / section Id to show or hide the dropdown menu,
 * popover, etc.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MouseService {

  target: Subject<string> = new Subject<string>();

  parent: Subject<string> = new Subject<string>();

  parentOffset: Subject<string> = new Subject<string>();

  container: Subject<Array<string>> = new Subject<Array<string>>();

  constructor() { }

  public setClickEvent(event: MouseEvent) {
    this._setTargetId(event);
    this._setTargetParentId(event);
    this._setTargetParentOffsetId(event);
    this._setAll(event);
  }

  private _setTargetId(event: MouseEvent) {
    if (event.target && (event.target as HTMLElement).id) {
      this.target.next((event.target as HTMLElement).id);
    } else {
      this.target.next('');
    }
  }

  public targetId(): Subject<string> {
    return this.target;
  }

  private _setTargetParentId(event: MouseEvent) {

    const targetElement: HTMLElement = event.target as HTMLElement;
    const parentNodeElement: HTMLElement = targetElement.parentNode as HTMLElement;

    if (targetElement && parentNodeElement && parentNodeElement.id) {
      this.parent.next(parentNodeElement.id);
    } else {
      this.parent.next('');
    }

  }

  public targetParentId(): Subject<string> {
    return this.parent;
  }

  private _setTargetParentOffsetId(event: MouseEvent) {

    const targetElement: HTMLElement = event.target as HTMLElement;
    const parentNodeElement: HTMLElement = targetElement.parentNode as HTMLElement;
    const parentOffsetElement: HTMLElement = parentNodeElement.offsetParent as HTMLElement;


    if (targetElement && parentNodeElement && parentOffsetElement && parentOffsetElement.id) {
      this.parentOffset.next(parentOffsetElement.id);
    } else {
      this.parentOffset.next('');
    }

  }

  public targetParentOffsetId(): Subject<string> {
    return this.parentOffset;
  }

  private _setAll(event: MouseEvent) {

    let ids: Array<string> = [];
    const targetElement: HTMLElement = event.target as HTMLElement;
    const parentNodeElement: HTMLElement = targetElement.parentNode as HTMLElement;
    const parentOffsetElement: HTMLElement = parentNodeElement.offsetParent as HTMLElement;

    if (targetElement.id) {
      ids.push(targetElement.id);
    }

    if (targetElement && parentNodeElement && parentNodeElement.id) {
      ids.push(parentNodeElement.id);
    }

    if (targetElement && parentNodeElement && parentOffsetElement && parentOffsetElement.id) {
      ids.push(parentOffsetElement.id);
    }

    this.container.next(ids);

  }

  public containerIds(): Subject<Array<string>> {
    return this.container;
  }

}
