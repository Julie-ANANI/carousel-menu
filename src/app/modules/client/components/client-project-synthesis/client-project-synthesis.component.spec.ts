import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectSynthesisComponent } from './client-project-synthesis.component';

describe('ClientProjectSynthesisComponent', () => {
  let component: ClientProjectSynthesisComponent;
  let fixture: ComponentFixture<ClientProjectSynthesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectSynthesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectSynthesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
