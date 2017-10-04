import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNewProjectComponent } from './client-new-project.component';

describe('ClientNewProjectComponent', () => {
  let component: ClientNewProjectComponent;
  let fixture: ComponentFixture<ClientNewProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientNewProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
