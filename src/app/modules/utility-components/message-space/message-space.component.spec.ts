import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSpaceComponent } from './message-space.component';

describe('MessageSpaceComponent', () => {
  let component: MessageSpaceComponent;
  let fixture: ComponentFixture<MessageSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
