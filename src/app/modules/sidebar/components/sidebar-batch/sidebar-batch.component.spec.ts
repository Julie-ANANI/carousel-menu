import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {SidebarBatchComponent} from './sidebar-batch.component';

describe('UserEditSidebarComponent', () => {
  let component: SidebarBatchComponent;
  let fixture: ComponentFixture<SidebarBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarBatchComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
