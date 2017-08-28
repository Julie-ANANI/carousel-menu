import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInnovationNewComponent } from './client-innovation-new.component';

describe('ClientInnovationNewComponent', () => {
  let component: ClientInnovationNewComponent;
  let fixture: ComponentFixture<ClientInnovationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInnovationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInnovationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
