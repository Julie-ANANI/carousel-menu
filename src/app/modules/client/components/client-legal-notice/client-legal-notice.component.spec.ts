import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLegalNoticeComponent } from './client-legal-notice.component';

describe('ClientLegalNoticeComponent', () => {
  let component: ClientLegalNoticeComponent;
  let fixture: ComponentFixture<ClientLegalNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLegalNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLegalNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
