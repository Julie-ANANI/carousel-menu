import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUploadZoneVideoComponent } from './shared-upload-zone-video.component';

describe('SharedUploadZoneVideoComponent', () => {
  let component: SharedUploadZoneVideoComponent;
  let fixture: ComponentFixture<SharedUploadZoneVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedUploadZoneVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedUploadZoneVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
