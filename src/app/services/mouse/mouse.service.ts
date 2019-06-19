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
    if (event.target && (event.target as HTMLElement).parentNode && (((event.target as HTMLElement).parentNode) as HTMLElement).id) {
      this.parent.next((((event.target as HTMLElement).parentNode) as HTMLElement).id);
    } else {
      this.parent.next('');
    }
  }

  public targetParentId(): Subject<string> {
    return this.parent;
  }

  private _setTargetParentOffsetId(event: MouseEvent) {
    if (event.target && (event.target as HTMLElement).parentNode && (((event.target as HTMLElement).parentNode) as HTMLElement).offsetParent
      && ((((event.target as HTMLElement).parentNode) as HTMLElement).offsetParent as HTMLElement).id) {
      this.parentOffset.next(((((event.target as HTMLElement).parentNode) as HTMLElement).offsetParent as HTMLElement).id);
    } else {
      this.parentOffset.next('');
    }
  }

  public targetParentOffsetId(): Subject<string> {
    return this.parentOffset;
  }

  private _setAll(event: MouseEvent) {
    let ids: Array<string> = [];

    if (event.target && (event.target as HTMLElement).id) {
      ids.push((event.target as HTMLElement).id);
    }

    if (event.target && (event.target as HTMLElement).parentNode && (((event.target as HTMLElement).parentNode) as HTMLElement).id) {
      ids.push((((event.target as HTMLElement).parentNode) as HTMLElement).id);
    }

    if (event.target && (event.target as HTMLElement).parentNode && (((event.target as HTMLElement).parentNode) as HTMLElement).offsetParent
      && ((((event.target as HTMLElement).parentNode) as HTMLElement).offsetParent as HTMLElement).id) {
      ids.push(((((event.target as HTMLElement).parentNode) as HTMLElement).offsetParent as HTMLElement).id);
    }

    this.container.next(ids);

  }

  public containerIds(): Subject<Array<string>> {
    return this.container;
  }

}
