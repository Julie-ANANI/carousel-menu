import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormHtmlComponent } from './dynamic-form-html.component';

describe('DynamicFormHtmlComponent', () => {
  let component: DynamicFormHtmlComponent;
  let fixture: ComponentFixture<DynamicFormHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
