import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAmbassadorFormComponent } from './add-ambassador-form.component';

describe('UserFormComponent', () => {
  let component: AddAmbassadorFormComponent;
  let fixture: ComponentFixture<AddAmbassadorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAmbassadorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAmbassadorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
