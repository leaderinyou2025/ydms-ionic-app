import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolDashboardPage } from './school-dashboard.page';

describe('SchoolDashboardPage', () => {
  let component: SchoolDashboardPage;
  let fixture: ComponentFixture<SchoolDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
