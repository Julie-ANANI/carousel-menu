import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectLangsComponent } from './admin-project-langs.component';

describe('AdminProjectLangsComponent', () => {
  let component: AdminProjectLangsComponent;
  let fixture: ComponentFixture<AdminProjectLangsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProjectLangsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProjectLangsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
