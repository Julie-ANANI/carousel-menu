import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplate1Component } from './message-template-1.component';

describe('MessageSpaceComponent', () => {
  let component: MessageTemplate1Component;
  let fixture: ComponentFixture<MessageTemplate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTemplate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
