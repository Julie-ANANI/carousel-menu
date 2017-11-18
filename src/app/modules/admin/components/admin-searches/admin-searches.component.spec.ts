import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSearchesComponent } from './admin-searches.component';

describe('AdminSearchesComponent', () => {
  let component: AdminSearchesComponent;
  let fixture: ComponentFixture<AdminSearchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSearchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
