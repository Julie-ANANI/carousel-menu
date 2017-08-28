import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUploadZonePhotoComponent } from './shared-upload-zone-photo.component';

describe('SharedUploadZonePhotoComponent', () => {
  let component: SharedUploadZonePhotoComponent;
  let fixture: ComponentFixture<SharedUploadZonePhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedUploadZonePhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedUploadZonePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
