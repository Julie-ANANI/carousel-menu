import {Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {SidebarInterface} from '../../interfaces/sidebar-interface';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss']
})

export class SidebarLeftComponent implements OnInit, OnDestroy {

  @Input() set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = {
      size: value.size || '263px',
      animate_state: value.animate_state || 'inactive',
      type: value.type || ''
    };
  }

  @Output() sidebarTemplateChange: EventEmitter<SidebarInterface> = new EventEmitter<SidebarInterface>();

  private _sidebarTemplate: SidebarInterface = <SidebarInterface>{};

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

  public toggleState(event: Event, target: any) {
    event.preventDefault();
    this._sidebarTemplate.animate_state = this._sidebarTemplate.animate_state === 'inactive' ? 'active' : 'inactive';
    this.sidebarTemplateChange.emit(this._sidebarTemplate);
    setTimeout(() => {
      target.scrollIntoView();
    }, 300);
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.removeChild(this._element);
    }
  }

}
