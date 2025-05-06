import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolGroupPage } from './school-group.page';

describe('SchoolGroupPage', () => {
  let component: SchoolGroupPage;
  let fixture: ComponentFixture<SchoolGroupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
