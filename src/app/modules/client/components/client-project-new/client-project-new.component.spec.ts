import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectNewComponent } from './client-project-new.component';

describe('ClientProjectNewComponent', () => {
  let component: ClientProjectNewComponent;
  let fixture: ComponentFixture<ClientProjectNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
