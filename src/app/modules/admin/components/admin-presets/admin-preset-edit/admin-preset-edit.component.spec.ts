import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPresetEditComponent } from './admin-preset-edit.component';

describe('AdminPresetEditComponent', () => {
  let component: AdminPresetEditComponent;
  let fixture: ComponentFixture<AdminPresetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPresetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPresetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
