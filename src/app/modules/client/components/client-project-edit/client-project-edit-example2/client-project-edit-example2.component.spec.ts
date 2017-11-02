import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectEditExample2Component } from './client-project-edit-example2.component';

describe('ClientProjectEditExample2Component', () => {
  let component: ClientProjectEditExample2Component;
  let fixture: ComponentFixture<ClientProjectEditExample2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectEditExample2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectEditExample2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
