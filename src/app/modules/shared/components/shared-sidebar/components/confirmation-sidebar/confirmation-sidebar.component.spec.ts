import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationSidebarComponent } from './confirmation-sidebar.component';

describe('ConfirmationSidebarComponent', () => {
  let component: ConfirmationSidebarComponent;
  let fixture: ComponentFixture<ConfirmationSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
