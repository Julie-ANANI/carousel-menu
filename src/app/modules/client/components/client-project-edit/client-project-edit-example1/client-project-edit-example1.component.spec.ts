import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectEditExample1Component } from './client-project-edit-example1.component';

describe('ClientProjectEditExample1Component', () => {
  let component: ClientProjectEditExample1Component;
  let fixture: ComponentFixture<ClientProjectEditExample1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectEditExample1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectEditExample1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
