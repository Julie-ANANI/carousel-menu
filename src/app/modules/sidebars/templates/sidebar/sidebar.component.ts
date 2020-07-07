import {Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SidebarInterface} from '../../interfaces/sidebar-interface';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger(('animateSidebar'), [
      state('inactive', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('inactive <=> active', animate('250ms ease-in-out')),
    ]),
  ]
})

export class SidebarComponent implements OnInit, OnDestroy {

  @Input() set template(value: SidebarInterface) {
    this._template = {
      type: value.type || '',
      animate_state: value.animate_state === undefined ? 'inactive' : value.animate_state || 'inactive',
      title: value.title || '',
      size: value.size || '452px'
    };
  }

  @Output() templateChange: EventEmitter<SidebarInterface> = new EventEmitter<SidebarInterface>();

  @Output() closeSidebar = new EventEmitter<SidebarInterface>(); // todo: remove this line

  private _template: SidebarInterface = <SidebarInterface>{};

  private readonly _element: any;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _elementRef: ElementRef) {
    this._element = this._elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this._element);
    }
  }

  /***
   * This function is to toggle the sidebar state and also to move up the scroll.
   * @param {Event} event
   * @param target
   */
  public toggleState(event: Event, target: any) {
    if ((event.target as HTMLElement).id === 'close') {
      this._emitChanges();
      setTimeout(() => {
        target.scrollIntoView();
      }, 300);
    }
  }

  private _emitChanges() {
    this.templateChange.emit({
      type: this._template.type,
      title: this._template.title,
      animate_state: 'inactive',
      size: this._template.size
    });
    this.closeSidebar.emit({
      animate_state: 'inactive',
      title: this._template.title,
      type: this._template.type
    }); // todo: remove this line
  }

  get template(): SidebarInterface {
    return this._template;
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.removeChild(this._element);
    }
  }

}

