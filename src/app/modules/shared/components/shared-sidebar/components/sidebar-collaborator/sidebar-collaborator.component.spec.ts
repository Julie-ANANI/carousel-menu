import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCollaboratorComponent } from './sidebar-collaborator.component';

describe('SidebarCollaboratorComponent', () => {
  let component: SidebarCollaboratorComponent;
  let fixture: ComponentFixture<SidebarCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
