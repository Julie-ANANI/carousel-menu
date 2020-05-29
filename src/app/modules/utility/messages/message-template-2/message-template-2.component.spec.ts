import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplate2Component } from './message-template-2.component';

describe('MessageSpaceComponent', () => {
  let component: MessageTemplate2Component;
  let fixture: ComponentFixture<MessageTemplate2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTemplate2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
