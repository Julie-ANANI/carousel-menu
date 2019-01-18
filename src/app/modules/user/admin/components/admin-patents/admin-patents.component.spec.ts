import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPatentsComponent } from './admin-patents.component';

describe('AdminPatentsComponent', () => {
  let component: AdminPatentsComponent;
  let fixture: ComponentFixture<AdminPatentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPatentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPatentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
