import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPresetNewComponent } from './admin-preset-new.component';

describe('AdminPresetNewComponent', () => {
  let component: AdminPresetNewComponent;
  let fixture: ComponentFixture<AdminPresetNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPresetNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPresetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
