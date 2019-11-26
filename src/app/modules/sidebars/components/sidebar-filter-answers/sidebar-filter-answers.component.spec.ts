import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFilterAnswersComponent } from './sidebar-filter-answers.component';

describe('SidebarFilterAnswersComponent', () => {
  let component: SidebarFilterAnswersComponent;
  let fixture: ComponentFixture<SidebarFilterAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarFilterAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarFilterAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
